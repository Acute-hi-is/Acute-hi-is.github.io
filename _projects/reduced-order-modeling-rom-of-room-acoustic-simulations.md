---
layout: project
title: Reduced Order Modeling (ROM) of Room Acoustic Simulations
status: active
tags:
  - Acoustics
  - Simulation
order: 60
team: >-
  Satish Kumar Bonthu, H. Sampedro Llopis, S. Thrastarson, F. Pind, Rúnar
  Unnþórsson
partners: Treble Technologies
funding: RANNÍS — Icelandic Research Fund
gallery_enabled: false
gallery: []
---

## Why reduce a room-acoustic model?

A room impulse response describes how sound travels from a source to a receiver and decays after a brief excitation. Wave-based simulation can capture effects such as interference and resonances, but repeatedly solving a full model can be expensive when comparing acoustic treatments. This project develops reduced-order models that approximate the time-domain response with fewer degrees of freedom.

## Published work on stability

The published study uses the linearized Euler equations and incorporates boundary-energy contributions into a structure-preserving formulation. It examines how unstable modes can arise after projection and tests the formulation on two-dimensional cases with rigid walls, frequency-independent absorption, and locally reacting frequency-dependent absorption.

For the cases studied, the proposed full-order formulation ran **3.5× faster** than the conventional formulation used for comparison. The paper also reports a **100-fold speedup** with reduced-order modeling. These timings apply to the numerical experiments in the paper, where the authors also examine the trade-offs among basis size, accuracy, and stability.

## Ongoing work on parametric room acoustics

The next question is whether a reduced basis built from simulations at selected boundary impedances can predict impulse responses at impedances outside the training set but within the parameter range studied. The work is extending this approach to three-dimensional test cases. Comparisons with full-order simulations will assess stability, impulse-response accuracy, and the cost of repeated predictions as wall absorption changes.
