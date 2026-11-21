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

### How the reduced model is built

1. Run a full-order simulation and collect time snapshots of acoustic pressure and velocity potential.
2. Use the combined snapshots to build a shared reduced basis. In the stabilized formulation, the snapshots also account for the boundary-energy contribution.
3. Evolve the reduced coefficients in time and reconstruct the pressure field or the response at a receiver.

## Benchmark gallery

<figure>
  <a href="{{ '/images/projects/room-acoustics-rom/room-setup.png' | relative_url }}"><img src="{{ '/images/projects/room-acoustics-rom/room-setup.png' | relative_url }}" alt="Rectangular room with labeled walls, a source, and a receiver" loading="lazy" style="display:block;max-width:100%;height:auto"></a>
  <figcaption>The 4 × 2 m benchmark room. The source is at (1.7, 1.2) m and the receiver at (0.25, 0.22) m.</figcaption>
</figure>

<figure>
  <video controls playsinline preload="none" aria-label="Four-panel comparison of sound propagation before and after model stabilization" poster="{{ '/images/projects/room-acoustics-rom/wave-propagation-poster.jpg' | relative_url }}" style="display:block;width:100%;height:auto">
    <source src="{{ '/images/projects/room-acoustics-rom/wave-propagation.mp4' | relative_url }}" type="video/mp4">
  </video>
  <figcaption>The top row compares the full-order and reduced-order pressure fields over 50 ms. The bottom row shows the 200 ms ROM before and after stabilization. Each panel retains its original simulation clock and pressure axis.</figcaption>
</figure>

<figure>
  <a href="{{ '/images/projects/room-acoustics-rom/energy-balance.png' | relative_url }}"><img src="{{ '/images/projects/room-acoustics-rom/energy-balance.png' | relative_url }}" alt="Normalized energy curves from the full-order simulation over 200 milliseconds" loading="lazy" style="display:block;max-width:100%;height:auto"></a>
  <figcaption>The full-order energy balance for the frequency-independent wall case. Tracking boundary energy alongside the interior field motivates its inclusion in the reduced basis (presentation slides 20–21).</figcaption>
</figure>

<figure>
  <a href="{{ '/images/projects/room-acoustics-rom/receiver-response.png' | relative_url }}"><img src="{{ '/images/projects/room-acoustics-rom/receiver-response.png' | relative_url }}" alt="Full-order and four stabilized reduced-order pressure traces over 200 milliseconds" loading="lazy" style="display:block;max-width:100%;height:auto"></a>
  <figcaption>Receiver impulse response for the full-order model and four stabilized ROM sizes with frequency-independent wall impedance. Figure 12(a), Bonthu et al. (2026). <a href='https://doi.org/10.1002/nme.70295'>Read the paper</a>.</figcaption>
</figure>

### Error across reduced-basis sizes

Both plots compare the full-order and reduced-order solutions using the L² norm for 200 ms simulations with frequency-independent wall impedance. They retain their original sampling and axis ranges.

<figure>
  <a href="{{ '/images/projects/room-acoustics-rom/basis-error-before.png' | relative_url }}"><img src="{{ '/images/projects/room-acoustics-rom/basis-error-before.png' | relative_url }}" alt="Log-scale L2 error versus reduced-basis size for the two original formulations" loading="lazy" style="display:block;max-width:100%;height:auto"></a>
  <figcaption>Slide 19. Error across basis sizes for the original pressure–velocity and pressure–velocity-potential formulations.</figcaption>
</figure>

<figure>
  <a href="{{ '/images/projects/room-acoustics-rom/basis-error-after.png' | relative_url }}"><img src="{{ '/images/projects/room-acoustics-rom/basis-error-after.png' | relative_url }}" alt="Log-scale L2 error versus reduced-basis size including the stabilized formulation" loading="lazy" style="display:block;max-width:100%;height:auto"></a>
  <figcaption>Slide 22. The stabilized pressure–velocity-potential series is shown alongside the two original formulations.</figcaption>
</figure>

## Ongoing work on parametric room acoustics

The next question is whether a reduced basis built from simulations at selected boundary impedances can predict impulse responses at impedances outside the training set but within the parameter range studied. The work is extending this approach to three-dimensional test cases. Comparisons with full-order simulations will assess stability, impulse-response accuracy, and the cost of repeated predictions as wall absorption changes.
