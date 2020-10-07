

const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("img");
    eleventyConfig.addPassthroughCopy("**/*.jpg");
    eleventyConfig.addPassthroughCopy("**/*.svg");
    eleventyConfig.setDataDeepMerge(true);
    eleventyConfig.addCollection("tagList", function(collection) {
      let tagSet = new Set();
      collection.getAll().forEach(function(item) {
        if( "tags" in item.data ) {
          let tags = item.data.tags;
  
          tags = tags.filter(function(item) {
            switch(item) {
              // this list should match the `filter` list in tags.njk
              case "all":
              case "nav":
              case "post":
              case "posts":
                return false;
            }
  
            return true;
          });
  
          for (const tag of tags) {
            tagSet.add(tag);
          }
        }
      });
  
      // returning an array in addCollection works in Eleventy 0.5.3
      return [...tagSet];
    });

    // Added for eleventy-img module
    eleventyConfig.addAsyncShortcode("Image", async (src, alt, cap) => {
      if (!alt) {
        throw new Error(`Missing \`alt\` on Image from: ${src}`);
      }
  
      let stats = await Image(src, {
        widths: [480, 800],
        formats: ["jpeg", "webp"],
        urlPath: "/images/",
        outputDir: "../obsolete29.com/images/",
      });
  
      let lowestSrc = stats["jpeg"][0];
      let highResJpeg = stats["jpeg"][1];
      let lowReswebp = stats["webp"][0];
      let highReswebp = stats["webp"][1];
    
  
      const srcset = Object.keys(stats).reduce(
        (acc, format) => ({
          ...acc,
          [format]: stats[format].reduce(
            (_acc, curr) => `${_acc} ${curr.srcset} ,`,
            ""
          ),
        }),
        {}
      );
  
      const source = `<source type="image/webp" media="(min-width: 800px)" srcset="${highReswebp.url}" >
                      <source type="image/webp" media="(max-width: 799px)" srcset="${lowReswebp.url}" >
                      <source type="image/jpeg" media="(max-width: 799px)" srcset="${lowestSrc.url}" >
                      <source type="image/jpeg" media="(min-width: 800px)" srcset="${highResJpeg.url}" >`;
  
      const img = `<img loading="lazy" alt="${alt}" src="${lowestSrc.url}">`;
  
      return `<figure class="image-wrapper"><picture>${source}${img}</picture><figcaption>${cap}</figcaption></figure>`;
    });
    
    // You can return your Config object (optional).
    return {
      dir: {
        output: "../obsolete29.com"
      }
    };
  };

