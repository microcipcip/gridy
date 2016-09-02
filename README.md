<p align="center">
	<a href="https://microcipcip.github.io/gridy" target="_blank">
		<img width="120" src="https://microcipcip.github.io/gridy/docs/src/img/general/logo.png">
	</a>
</p>

<div stlye="text-align: center;">
	<h1 style="border: none;">Gridy</h1>
	<h2 style="border: none; margin-top: 0;">A kickass flex grid, powered by SASS</h2>
</div>

[![Join the chat at https://gitter.im/flex-gridy/Lobby](https://badges.gitter.im/flex-gridy/Lobby.svg)](https://gitter.im/flex-gridy/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

v. *0.9.0*

**Simple definition**: Adj. gridier, gridiest; Having or showing a desire to build flexbox grids
 in large or excessive amounts. 

## Why gridy?

I have build Gridy out of the frustration with the _bloated grid systems_ currently available.

Why should I be forced to use **billions of nested rows and columns**** just for styling relatively simple website layouts?

Why do I have to resort on **crazy nth-child and clearfix**, with **hardcoded media queries** and with **arbitrary and rigidly** set number of columns when building image gallery layouts?

Why do I have to use **absolute positioning** for centering elements in the grid and use **javascript to equalize the height** of the columns?

If you have experienced my problems, I feel your pain! But don't worry...you can now rely on Gridy to overcame all these issues!

## Features

Here's a list of Gridy features:

- Responsive columns, set from the parent
- Responsive columns, set from the children
- Responsive columns, set from both parent and children
- Nesting directly in the column!
- Auto width columns
- Auto height columns
- Auto clearfix!
- No more rows! No bloat!
- Gutter helpers
- Ordering and positioning helpers
- Offset helpers

## Getting started

You can install Gridy either by including the [CSS file](https://github.com/microcipcip/gridy/tree/master/dist), 
or directly by adding the [SASS files](https://github.com/microcipcip/gridy/tree/master/src) in your project.

Head to the [Customization section](https://microcipcip.github.io/gridy/#!/customization) to learn how to customize the grid with SASS.

## Usage

Gridy is easy to use. Just add a `gy="g"` 
data attribute to make the grid and a `gy="c"` data attribute to make the columns. View more details on the [Gridy website](https://microcipcip.github.io/gridy)
```
<div gy="g">
	<div gy="c">...</div>
	<div gy="c">...</div>
</div>
<div gy="g">
	<div gy="c">...</div>
	<div gy="c">...</div>
</div>
<div gy="g">
	<div gy="c">...</div>
	<div gy="c">...</div>
	<div gy="c">...</div>
</div>
```


## Acknowledgement

Gridy is heavily based on the work of [Laurent G.](https://github.com/devlint) author of the 
amazing [Gridlex grid system](http://gridlex.devlint.fr/index.html) which inspired this project. 

** To be fair, before flexbox it was difficult to fix these problems