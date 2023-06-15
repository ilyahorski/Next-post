export const parseTags = (tagsString) => {
  return tagsString.split(',').map(tag => {
    let trimmedTag = tag.trim();
    if (trimmedTag.startsWith('#')) {
      return trimmedTag;
    } else {
      return '#' + trimmedTag;
    }
  });
};