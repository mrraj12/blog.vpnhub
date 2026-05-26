module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });

  eleventyConfig.addFilter("readableDate", function(dateObj) {
    if (!dateObj) return "";

    const date = new Date(dateObj);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // All tutorials/posts, newest first
  eleventyConfig.addCollection("allTutorials", function(collectionApi) {
    return collectionApi
      .getFilteredByTag("posts")
      .sort(function(a, b) {
        return new Date(b.data.date) - new Date(a.data.date);
      });
  });

  // Homepage pinned tutorials only
  // Add featured: true in post frontmatter to show here
  eleventyConfig.addCollection("pinnedTutorials", function(collectionApi) {
    return collectionApi
      .getFilteredByTag("posts")
      .filter(function(post) {
        return post.data.featured === true;
      })
      .sort(function(a, b) {
        return new Date(b.data.date) - new Date(a.data.date);
      })
      .slice(0, 3);
  });

  // Tutorials page posts
  // These are all posts except featured/pinned tutorials
  eleventyConfig.addCollection("regularTutorials", function(collectionApi) {
    return collectionApi
      .getFilteredByTag("posts")
      .filter(function(post) {
        return post.data.featured !== true;
      })
      .sort(function(a, b) {
        return new Date(b.data.date) - new Date(a.data.date);
      });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
