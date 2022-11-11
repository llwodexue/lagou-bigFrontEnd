export default function createFileChunk(file, size) {
  const fileChunkList = [];
  let cur = 0;
  let index = 0;

  while (cur < file.size) {
    // File 接口基于 Blob 接口，利于 Blob 接口的 slice 方法实现切片
    fileChunkList.push({
      chunk: file.slice(cur, cur + size),
      index,
    });

    cur += size;
    index += 1;
  }

  return fileChunkList;
}
