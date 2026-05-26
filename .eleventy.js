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

  function sortNewestFirst(posts) {
    return posts.sort(function(a, b) {
      return new Date(b.data.date || 0) - new Date(a.data.date || 0);
    });
  }

  function isFeatured(post) {
    return post.data.featured === true || post.data.featured === "true";
  }

  function getAllTutorialPosts(collectionApi) {
    return sortNewestFirst(
      collectionApi.getFilteredByGlob("./src/posts/*.md")
    );
  }

  function getHomepageTutorialPosts(collectionApi) {
    const allPosts = getAllTutorialPosts(collectionApi);

    const featuredPosts = allPosts.filter(function(post) {
      return isFeatured(post);
    });

    const normalPosts = allPosts.filter(function(post) {
      return !isFeatured(post);
    });

    const homepagePosts = [];

    featuredPosts.forEach(function(post) {
      if (homepagePosts.length < 3) {
        homepagePosts.push(post);
      }
    });

    normalPosts.forEach(function(post) {
      if (homepagePosts.length < 3) {
        homepagePosts.push(post);
      }
    });

    return homepagePosts.slice(0, 3);
  }

  eleventyConfig.addCollection("allTutorials", function(collectionApi) {
    return getAllTutorialPosts(collectionApi);
  });

  eleventyConfig.addCollection("homepageTutorials", function(collectionApi) {
    return getHomepageTutorialPosts(collectionApi);
  });

  eleventyConfig.addCollection("pinnedTutorials", function(collectionApi) {
    return getHomepageTutorialPosts(collectionApi);
  });

  eleventyConfig.addCollection("regularTutorials", function(collectionApi) {
    const allPosts = getAllTutorialPosts(collectionApi);
    const homepagePosts = getHomepageTutorialPosts(collectionApi);

    const homepageUrls = homepagePosts.map(function(post) {
      return post.url;
    });

    return allPosts.filter(function(post) {
      return !homepageUrls.includes(post.url);
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
