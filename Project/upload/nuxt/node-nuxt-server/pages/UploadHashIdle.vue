<template>
  <div class="upload-file">
    <el-form>
      <el-form-item>
        <div class="drag-container" ref="drag">
          <input type="file" name="file" id="" @change="handleFileChange" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-progress :stroke-width="15" :text-inside="true" :percentage="progress"></el-progress>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="uploadFile">上传</el-button>
      </el-form-item>

      <el-form-item>
        <p>计算 hash 的进度</p>
        <el-progress :stroke-width="15" :text-inside="true" :percentage="hashProgress"></el-progress>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import sparkMd5 from 'spark-md5'

const CHUNCK_SIZE = 0.1 * 1024 * 1024
export default {
  data() {
    return {
      file: '',
      progress: 0,
      chunks: null,
      worker: null,
      hashProgress: 0
    }
  },
  mounted() {
    this.bindEvent()
  },
  methods: {
    bindEvent() {
      const drag = this.$refs.drag
      drag.addEventListener('dragover', e => {
        drag.style.borderColor = '#ff00f0'
        e.preventDefault()
      })

      drag.addEventListener('draglive', e => {
        drag.style.borderColor = '#ccc'
        e.preventDefault()
      })

      drag.addEventListener('drop', e => {
        drag.style.borderColor = '#ccc'
        const fileList = e.dataTransfer.files
        this.file = fileList[0]
        e.preventDefault()
      })
    },
    handleFileChange(e) {
      const [file] = e.target.files
      if (!file) return
      this.file = file
    },

    // 通过文件流来判断当前文件是否是图片
    async isImage(file) {
      return (await this.isGif(file)) || (await this.isPng(file)) || (await this.isJpeg(file))
    },

    async isGif(file) {
      // GIF89a  GIF87a
      // 前面6个16进制是  47 49 46 38 39 61  或  47 49 46 38 37 61
      // 16 进制转换
      const ret = await this.blobToString(file.slice(0, 6))
      console.log('isGif', ret)
      return ret == '474946383961' || ret == '474946383761'
    },

    async isPng(file) {
      // 89 50 4E 47 0D 0A 1A 0A
      const ret = await this.blobToString(file.slice(0, 8))
      return ret == '89504E470D0A1A0A'
    },

    async isJpeg(file) {
      // 前两个  FF D8   后两个 FF D9
      const len = file.size
      const start = await this.blobToString(file.slice(0, 2))
      const end = await this.blobToString(file.slice(-2, len))
      return start == 'FFD8' && end == 'FFD9'
    },

    async blobToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = function () {
          const ret = reader.result
            .split('')
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            .map(v => v.padStart(2, '0'))
            .join('')
          resolve(ret)
        }
        reader.readAsBinaryString(blob)
      })
    },

    // 文件碎片, size 为每一个区块的大小
    async createFileChunck(file, size = CHUNCK_SIZE) {
      const chunks = []
      let cur = 0
      while (cur < this.file.size) {
        chunks.push({ index: cur, file: this.file.slice(cur, cur + size) })
        cur += size
      }
      return chunks
    },

    // webworker 计算 md5
    async calculateHashWorker() {
      return new Promise(resolve => {
        this.worker = new Worker('./hash.js')
        this.worker.postMessage({ chunks: this.chunks })
        this.worker.onmessage = e => {
          const { progress, hash } = e.data
          this.hashProgress = Number(progress.toFixed(2))
          if (hash) resolve(hash)
        }
      })
    },

    // 时间切片的方式
    async calculateHashIdle() {
      return new Promise(resolve => {
        const spark = new sparkMd5.ArrayBuffer()
        let count = 0

        const appendToSpark = async file => {
          return new Promise(res => {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = e => {
              spark.append(e.target.result)
              res()
            }
          })
        }

        const wrokLoop = async deadline => {
          while (count < this.chunks.length && deadline.timeRemaining() > 1) {
            // 空闲时间, 且有任务
            await appendToSpark(this.chunks[count].file)
            count++
            if (count < this.chunks.length) {
              this.hashProgress = Number(((100 * count) / this.chunks.length).toFixed(2))
            } else {
              this.hashProgress = 100
              resolve(spark.end())
            }
          }
          window.requestIdleCallback(wrokLoop)
        }
        window.requestIdleCallback(wrokLoop)
      })
    },

    async uploadFile() {
      //if(!await this.isImage(this.file)) return this.$alert('文件格式不对~');

      this.chunks = await this.createFileChunck(this.file)
      //const hash = await this.calculateHashWorker();
      const hash = await this.calculateHashIdle()

      console.log(this.chunks)
      console.log('文件hash值:', hash)

      return
      const form = new FormData()
      form.append('name', 'file')
      form.append('file', this.file)

      const ret = await this.$http.post('/uploadFile', form, {
        onUploadProgress: progress => {
          this.progress = Number(((progress.loaded / progress.total) * 100).toFixed(2))
        }
      })
      console.log(ret)
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-container {
  width: 400px;
  height: 200px;
  border: 1px dashed #ccc;
  text-align: center;
  line-height: 200px;
  &:hover {
    border: 1px dashed #ff00f0;
  }
}
</style>
