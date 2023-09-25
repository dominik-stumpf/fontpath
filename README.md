# fontpath

Small utility that converts fonts to SVG paths dynamically with variable font support.

## usage

There are 3 types of output the code can create in the `/generated` folder;

1. `/generated/svg/g.svg` - after conversion the result is hardcoded into svg (hard to modify later)
2. `/generated/json/g.json` - better alternative than svg, but lacks type inference
3. `/generated/ts/g.ts`/ - **recommended** used for manually assembling the svg

### examples

> In this project the all wonderful [Fraunces](https://fonts.google.com/specimen/Fraunces) typeface is being used by default and also in all the examples. I find it a good example because it has a lot of customization options.

In the case of variable fonts *fontkit* supports all custom typeface axis like italic (`slnt`), font weights (`wght`), so they can be set freely.

```ts
font.getVariation({ wght: 400, opsz: 144, wonk: 1, soft: 0 });
```

![Image of a letter converted to path](/examples/font-converted-to-path.png)
Image of a letter converted to svg path in Figma.



## why?

I created this for a specific use case which is animation, but I see a potential in this as reducing the [LCP](https://web.dev/optimize-lcp/) for webpages by using svg in hero page sections for large display text and making people avoid common mistakes when animating fonts.

## how does it work?

Under the hood it uses [fontkit](https://github.com/foliojs/fontkit) and would be ideal to expose more of it's api using this tool.


## future

As of now the code runs only in Node environment *without any api or convenience*, but there is plan to make it browser only with a React app for ease of use and quick encodings.
