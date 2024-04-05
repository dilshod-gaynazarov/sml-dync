export async function chunkData(data: any) {
  let chunks = [];
  if (data.length <= 7) {
    chunks.push(data);
  } else if (data.length >= 8 && data.length < 15) {
    const chunk_size = Math.ceil(data.length / 2);
    for (let i = 0; i < data.length; i += chunk_size) {
      chunks.push(data.slice(i, i + chunk_size));
    }
  } else if (data.length >= 15) {
    const chunk_size = Math.ceil(data.length / 3);
    for (let i = 0; i < data.length; i += chunk_size) {
      chunks.push(data.slice(i, i + chunk_size));
    }
  }
  return chunks;
}
