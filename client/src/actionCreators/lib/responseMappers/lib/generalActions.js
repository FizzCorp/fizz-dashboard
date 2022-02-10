// exports - general
export function mapList(data) {
  return data.reduce((hash, current) => {
    hash[current.id] = current;
    return hash;
  }, {});
}