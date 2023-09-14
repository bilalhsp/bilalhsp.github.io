---
title: 'Create Your Own Colormaps'
date: 2023-09-04
author: Hamid Ali Syed
permalink: /posts/2023/09/colormaps/
tags:
  - colormap
  - python
---

# Create Your Own Colormaps
- author: Hamid Ali Syed
- email: windcirculation[at]gmail[dot]com
- date: Sep 04, 2023

## Introducing [Colormaps](https://syedha.com/colormaps)

### Overview
Welcome to this interactive tutorial on creating custom colormaps. By the end of this post, you'll be able to design your own colormaps effortlessly by manipulating RGB lines according to your preferences.

### Step 1: Design Your Colormap
1. Visit [https://syedha.com/colormaps](https://syedha.com/colormaps).
2. Use the interactive tool to drag the RGB lines until you achieve your desired colormap.

### Step 2: Copy Your Colormap
1. In the 'Copy Your Colormap' section, select the option to copy the colormap as plain text.
2. Click the 'Copy' button to copy the colormap matrix to your clipboard.

### Step 3: Apply Your Colormap
1. Launch Jupyter Notebook or your preferred Python environment.
2. Run the following code while the copied matrix is still in your clipboard:


        import pandas as pd
        import matplotlib as mpl
        import numpy as np

        def create_colorbar_from_clipboard():
            df = pd.read_clipboard(header=None)
            df.columns = ['R', 'G', 'B']
            c = np.array(df/255.0)
            cm = mpl.colors.ListedColormap(c)
            return cm

        cmap = create_colorbar_from_clipboard()
        cmap


Congratulations! You've successfully created your custom colormap. Feel free to reach out if you need further assistance or have any questions.

Best,<br>
*Hamid*