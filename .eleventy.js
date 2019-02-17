module.exports = function(eleventyConfig) {
  // Create a collection for blog posts only.
  /* eleventyConfig.addCollection("learnPosts", collection => {
    return collection.getFilteredByGlob("learn/*.md");
  }); */

  eleventyConfig.addPairedShortcode("note", function(content) {
    return `<div class="note">${content}</div>`;
  });

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("_data");
  eleventyConfig.addPassthroughCopy("robots.txt");

  return {};
};
