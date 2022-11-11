<template>
  <div id="app">
    <div class="top">
      <input
        :disabled="status !== Status.wait"
        type="file"
        ref="input"
        @change="handleFileChange"
      />
      <el-button
        @click="handleUpload"
        :loading="status === Status.uploading"
      >
        上传
      </el-button>
      <el-button
        @click="handlePause"
        v-if="status === Status.uploading"
      >
        暂停
      </el-button>
      <el-button
        @click="handleResume"
        v-if="status === Status.pause"
      >
        恢复
      </el-button>
      <el-button type="danger" @click="handleClear">清空</el-button>
    </div>
    <div>
      <div>计算文件 hash</div>
      <el-progress :percentage="hashPercentage"></el-progress>
      <div>总进度</div>
      <el-progress :percentage="uploadPercentage"></el-progress>
    </div>
    <el-table :data="chunkList">
      <el-table-column
        prop="hash"
        label="切片hash"
        align="center"
      />
      <el-table-column label="大小(KB)" align="center" width="120">
        <template v-slot="{ row }">
          {{ row.size | transformByte }}
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center">
        <template v-slot="{ row }">
          <el-progress
            :percentage="row.percentage"
            color="#909399"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import createFileChunk from './utils/createFileChunk';
import { post } from './utils/request';
// 定义文件切块大小
// chrome 保存在内存中最大的尺寸是 10M，超出后无法显示
const CHUNK_SIZE = 2 * 1024 * 1024;

// 上传状态
const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading',
};

export default {
  name: 'App',
  data() {
    return {
      Status,
      container: {
        file: null,
        hash: null,
        worker: null,
      },
      hashPercentage: 0,
      chunkList: [],
      requestList: [],
      status: Status.wait,
    };
  },
  computed: {
    uploadPercentage() {
      if (!this.container.file || !this.chunkList.length) return 0;
      const loaded = this.chunkList
        .map(chunk => chunk.size * (chunk.percentage / 100))
        .reduce((total, cur) => total + cur, 0);
      return parseInt((loaded / this.container.file.size) * 100);
    }
  },
  filters: {
    transformByte(val) {
      return Number((val / 1024).toFixed(0));
    }
  },
  methods: {
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.container.file = file;
    },
    createProgressHandle(item) {
      return e => {
        item.percentage = parseInt((e.loaded / e.total) * 100);
      };
    },
    // 通过 web-worker 计算 hash
    calculateHash(fileChunkList) {
      return new Promise(resolve => {
        this.container.worker = new Worker('/hash.js');
        this.container.worker.onmessage = e => {
          const { percentage, hash } = e.data;
          this.hashPercentage = percentage;
          if (hash) {
            resolve(hash);
          }
        };
        this.container.worker.postMessage({ fileChunkList });
      });
    },
    async handleUpload() {
      if (!this.container.file) return;

      this.status = Status.uploading;

      const fileChunkList = createFileChunk(this.container.file, CHUNK_SIZE);
      const fileHash = await this.calculateHash(fileChunkList);

      const { shouldUpload, uploadedList } = await post('http://localhost:3000/verify', {
        filename: this.container.file.name,
        fileHash,
      });

      if (!shouldUpload) {
        this.$message.success('文件已经上传成功');
        this.status = Status.pause;
        return;
      }

      this.chunkList = fileChunkList.map(({ chunk, index }) => ({
        hash: `${fileHash}-${index}`,
        index,
        size: chunk.size,
        percentage: 0,
        chunk,
      }));
      this.container.hash = fileHash;

      this.uploadChunks(uploadedList);
    },
    async handleResume() {
      this.status = Status.uploading;
      const { uploadedList } = await post('http://localhost:3000/verify', {
        filename: this.container.file.name,
        fileHash: this.container.hash,
      });

      this.uploadChunks(uploadedList);
    },
    async uploadChunks(uploadedList = []) {
      const requestList = this.chunkList
        // 过滤已经上传过的切片
        .filter(({ hash }) => !uploadedList.includes(hash))
        .map(async ({ chunk, hash, index }) => {
          const formData = new FormData();

          formData.append('chunk', chunk);
          formData.append('hash', hash);
          formData.append('fileHash', this.container.hash);

          return await post(
            'http://localhost:3000',
            formData,
            {},
            this.createProgressHandle(this.chunkList[index]),
            this.requestList,
          );
        });

      await Promise.all(requestList);

      // 已上传的切片 + 本次上传的切片 = 所有切片时
      if (uploadedList.length + requestList.length === this.chunkList.length) {
        // 发送合并请求
        await post('http://localhost:3000/merge', {
          filename: this.container.file.name,
          fileHash: this.container.hash,
        });
        this.$message.success('上传成功');
        this.status = Status.wait;
      }
    },
    async handleClear() {
      await post('http://localhost:3000/clear');
      this.container.hash = null;
      this.container.worker = null;
      this.hashPercentage = 0;
      this.chunkList = [];
      this.requestList = [];
      this.status = Status.wait;
      this.$message.success('清空成功');
    },
    // 这里的暂停实际上是取消正在上传的切片，恢复的时候需要重新上传这些切片，会出现进度条后退的情况
    handlePause() {
      this.status = Status.pause;
      this.requestList.forEach(xhr => xhr?.abort());
      this.requestList = [];
    }
  }
};
</script>

<style>
#app {
  padding: 20px;
}
.top {
  text-align: center;
  margin: 20px 0;
}
</style>
