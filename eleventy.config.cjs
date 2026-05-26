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

  function isPostFile(item) {
    if (!item || !item.inputPath) return false;

    const normalizedPath = item.inputPath.replace(/\\/g, "/");

    return (
      normalizedPath.includes("/posts/") &&
      normalizedPath.endsWith(".md")
    );
  }

  function isFeatured(post) {
    return (
      post.data.featured === true ||
      post.data.featured === "true" ||
      post.data.featured === "True"
    );
  }

  function getAllTutorialPosts(collectionApi) {
    const posts = collectionApi
      .getAll()
      .filter(isPostFile);

    return sortNewestFirst(posts);
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
    const posts = getAllTutorialPosts(collectionApi);
    console.log("VPNHUB all tutorials found:", posts.length);
    return posts;
  });

  eleventyConfig.addCollection("homepageTutorials", function(collectionApi) {
    const posts = getHomepageTutorialPosts(collectionApi);
    console.log("VPNHUB homepage tutorials found:", posts.length);
    return posts;
  });

  eleventyConfig.addCollection("pinnedTutorials", function(collectionApi) {
    return getHomepageTutorialPosts(collectionApi);
  });

  eleventyConfig.addCollection("regularTutorials", function(collectionApi) {
    const allPosts = getAllTutorialPosts(collectionApi);
    const homepagePosts = getHomepageTutorialPosts(collectionApi);

    const homepageInputPaths = homepagePosts.map(function(post) {
      return post.inputPath;
    });

    return allPosts.filter(function(post) {
      return !homepageInputPaths.includes(post.inputPath);
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
