# Modeling Bivariate Directional Dependence

Interactive case-study site for the senior thesis *Modeling Bivariate Directional Dependence using Order Statistics and Concomitants* (Ratul & Sungur, University of Minnesota, Morris).

**Live:** https://research-directional-dependence.vercel.app

## Stack
- Next.js 16 (App Router) · React 19 · TypeScript
- KaTeX for server-rendered mathematics
- three.js / @react-three/fiber / drei for the interactive 3D directional-dependence surface
- Deployed on Vercel

## What's inside
- The full method: order statistics, concomitants, and the sampling algorithm `X = a1*U + a2*V`, `Y = b1*U + b2*V`
- A live sampler that computes the directional correlations and calls the dominant direction
- A WebGL surface of the directional gap over the parameter contrasts, simulated in the browser
- Real results from the thesis (Uniform vs Normal) and the 100-run parameter search

Source research artifacts: https://github.com/ratul003/Modeling-Directional-Dependence-using-Order-Statistics-and-Concomitants
