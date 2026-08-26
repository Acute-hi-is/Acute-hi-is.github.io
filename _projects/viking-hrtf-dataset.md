---
layout: project
title: Viking HRTF Dataset
status: completed
tags:
  - Acoustics
order: 40
team: "Eric M. Sumner, S. Spagnol, R. Fernandez Martinez, M. Riedel, Rúnar Unnþórsson"
partners: ""
funding: ""
gallery_enabled: false
gallery: []
---

An open, full-sphere Head-Related Transfer Function dataset measured at **1,513 spatial positions** on a KEMAR mannequin fitted with 20 custom-molded silicone pinnae. The dataset enables controlled study of how pinna shape influences spatial hearing cues, and underpins machine learning efforts to predict personalised HRTFs.

Synthetic pinnae manufactured with 0.25 mm scanner accuracy allow isolation of individual anthropometric effects &mdash; something impossible with natural ears. An MLP trained on 15 anthropometric parameters achieved **3.54% mean prediction error** for HRTFs (vs. ~15% with a standard KEMAR). A separate model predicting the lowest pinna spectral notch from 3D meshes achieved **3.3% median mismatch**, halving prior methods.
