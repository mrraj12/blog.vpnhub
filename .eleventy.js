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

  function getAllPosts(collectionApi) {
    return sortNewestFirst(collectionApi.getFilteredByTag("posts"));
  }

  function getHomepagePosts(collectionApi) {
    const allPosts = getAllPosts(collectionApi);

    const featuredPosts = allPosts.filter(function(post) {
      return isFeatured(post);
    });

    const nonFeaturedPosts = allPosts.filter(function(post) {
      return !isFeatured(post);
    });

    const homepagePosts = [];

    featuredPosts.forEach(function(post) {
      if (homepagePosts.length < 3) {
        homepagePosts.push(post);
      }
    });

    nonFeaturedPosts.forEach(function(post) {
      if (homepagePosts.length < 3) {
        homepagePosts.push(post);
      }
    });

    return homepagePosts.slice(0, 3);
  }

  eleventyConfig.addCollection("allTutorials", function(collectionApi) {
    return getAllPosts(collectionApi);
  });

  // Homepage system:
  // featured true first, then auto-fill with latest posts until 3 posts
  eleventyConfig.addCollection("homepageTutorials", function(collectionApi) {
    return getHomepagePosts(collectionApi);
  });

  // Old name support, in case your index.njk still uses pinnedTutorials
  eleventyConfig.addCollection("pinnedTutorials", function(collectionApi) {
    return getHomepagePosts(collectionApi);
  });

  // Tutorials page:
  // show all posts except the 3 posts already shown on homepage
  eleventyConfig.addCollection("regularTutorials", function(collectionApi) {
    const allPosts = getAllPosts(collectionApi);
    const homepagePosts = getHomepagePosts(collectionApi);

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
