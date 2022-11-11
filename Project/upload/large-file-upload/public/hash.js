self.importScripts('/spark-md5.min.js');

self.onmessage = (e) => {
  const { fileChunkList } = e.data;
  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;

  const loadNext = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileChunkList[index].chunk);
    reader.onload = (e) => {
      // 累加器，不能依赖 index
      count++;
      // 增量计算md5
      spark.append(e.target.result);
      if (count === fileChunkList.length) {
        // 通知主线程，计算结束
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        self.close();
      } else {
        // 每个区块计算结果，通知进度即可
        percentage += 100 / fileChunkList.length;
        self.postMessage({
          percentage,
        });
        // 递归计算下一个切片
        loadNext(count);
      }
    };
  };

  loadNext(count);
};
