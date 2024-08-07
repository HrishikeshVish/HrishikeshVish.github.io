---
layout: post
title:  Machine Learning Essentials
date: 2023-10-04 21:01:00
description: Resources to learn ML
tags: 
categories:
thumbnail: assets/img/9.jpg
featured: true
---
<div class="col-md-8 pt-5 about" style="font-family:Garamond, Verdana, Geneva, Tahoma, sans-serif">
<br><br><br>
<p class="h4"></p>

This page provides a list of topics and resources to build a good undergraduate level foundation in various topics related to Machine Learning,
Linear Algebra, Artificial Intelligence, Information Retrieval, Social Networks, Deep Learning and Statistics <br><br><br>

<h5>Foundation/Basics</h5>
<br>
<a href="https://www.youtube.com/playlist?list=PLyqSpQzTE6M9gCgajvQbc68Hk_JKGBAYT">Deep Learning - NPTEL IIT M</a><br>
<a href="https://www.youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI">MIT 6.S191: Introduction to Deep Learning</a><br>
<a href="https://github.com/pg/intellidrive/blob/master/research/Machine%20Learning%20-%20Tom%20Mitchell.pdf">Machine Learning: Tom Mitchell</a><br>
<a href="https://towardsdatascience.com/optimizers-for-training-neural-network-59450d71caf6">Various Optimization Algorithms For Training Neural Network | Towards Data Science</a><br>

<a href="https://towardsdatascience.com/activation-functions-neural-networks-1cbd9f8d91d6">Activation Functions in Neural Networks | by SAGAR SHARMA | Towards Data Science</a><br>
<a href="https://towardsdatascience.com/common-loss-functions-in-machine-learning-46af0ffc4d23">Common Loss functions in machine learning | by Ravindra Parmar | Towards Data Science</a><br>

<a href="https://www.youtube.com/channel/UC5zx8Owijmv-bbhAK6Z9apg/playlists">Artificial Intelligence - All in One - YouTube</a><br>
<a href="https://www.youtube.com/channel/UCcIXc5mJsHVYTZR1maL5l9w/playlists">DeepLearningAI - YouTube</a><br><br>
<br>
<h6>Conceptual Introduction</h6>
<ul>
    <li>Perceptron - What is a perceptron, how does it learn linear functions, What type of logical gates can it learn? What about XOR?
    </li>
    <li>Linear functions vs. non-linear functions</li>
    <li>How to deal with non-linearity? Activation functions - Sigmoid, RELU, TanH (Where to use these activations - binary classification, multi-class classification, softmax type situations, regression) 
    </li>
    <li>Regression vs. classification</li>
</ul>

<h6>Math behind “Learning”</h6>
<ul>
    <li>Minimization of loss</li>
    <li>Dynamic Learning Rate</li>
    <li>Backpropagation math</li>
    <li>Difference between overfitting and under-fitting - What happens when u can fully learn the training data but cannot fit to test data
    </li>
    <li>Momentum - how to gradually converge to the target function that you are trying to learn
    </li>
    <li>Exponential smoothing - how is momentum a smoothing function?
    </li>
    <li>Nesterov’s accelerated gradient - Look ahead momentum
    </li>
    <li>AdaGrad, RMSProp, Adam Optimizers
    </li>
    <li>Different Types of Errors
    </li>
    <li>Mean Squared Error</li>
    <li>L1 Loss, L2 Loss</li>
    <li>Regularization - What is it? Lasso and Ridge</li>
    <li>Dropout - why is it necessary</li>
    <li>Batch Normalization vs. Layer Normalization</li>
    <li>Binary Cross Entropy</li>
    <li>What is Entropy?</li>
    <li>KL Divergence - How are two distributions similar, different? What is the distance between two distributions
    </li>
    <li>Precision, Accuracy, Recall, F1 Score, ROC Curve
    </li>
</ul>
<h6>Handling Images, Graphics (Computer Vision)</h6>
<br>
<a href="https://machinelearningmastery.com/what-are-generative-adversarial-networks-gans/">A Gentle Introduction to Generative Adversarial Networks (GANs) - MachineLearningMastery.com</a><br>
<a href="http://deeplearning.stanford.edu/tutorial/supervised/ConvolutionalNeuralNetwork/">Unsupervised Feature Learning and Deep Learning Tutorial (stanford.edu)</a><br>
<a href="https://towardsdatascience.com/convolutional-neural-networks-explained-9cc5188c4939">Convolutional Neural Networks, Explained | by Mayank Mishra | Towards Data Science</a><br>
<br>

<ul>
    <li>Autoencoders - Reducing dimensions, Minimizing Standard Deviation + KL Divergence - Variational Autoencoders
    </li>
    <li>Denoising Autoencoders</li>
    <li>Convolutional Neural Networks - 2D Filters, 3D Filters</li>
    <li>Activation Map, Max Pooling, Average Pooling</li>
    <li>3D Filters, 2D Filters</li>
    <li>Vanishing Gradient</li>
    <li>Generative Adversarial Networks</li>
    <li>Fine tuning and Transfer Learning</li>
    <li>YOLO models</li>
    <li>DALL-E</li>
    <li>When do GANS achieve convergence - Nash Equilibrium. Why is it adversarial training?</li>
</ul>
<h6>Artificial Intelligence</h6>
<br>
<a href="https://www.youtube.com/playlist?list=PLUl4u3cNGP63gFHB6xb-kVBiQHYe_4hSi">MIT 6.034 Artificial Intelligence, Fall 2010</a><br>
<a href="https://github.com/aimacode/aima-python">Python implementation of algorithms from Russell And Norvig's "Artificial Intelligence - A Modern Approach":Acknowledgements (berkeley.edu)</a><br>
<a href="https://github.com/yanshengjia/ml-road/blob/master/resources/Artificial%20Intelligence%20-%20A%20Modern%20Approach%20(3rd%20Edition).pdf">Artificial Intelligence: A Modern Approach Russell and Norvig 3rd Edition</a><br>
<br>
<ul>
    <li>Solving problems by searching for the solution in a space of solutions
    </li>
    <li>Intelligent agents - Rationality
    </li>
    <li>Uninformed search - DFS, BFS, Depth limited search, iterative deepening search
    </li>
    <li>Search strategies - Greedy heuristic search, A-Star search
    </li>
    <li>Local Search - Hill Climbing search, Stochastic Hill Climbing, Simulated annealing, beam search, gradient descent, Genetic Algorithm (Important)
    </li>
    <li>Adversarial search, games, Alpha Beta Pruning, Minimax games - Tic Tac Toe
    </li>
    <li>Constraint Satisfaction problems - Map Coloring with constraints
    </li>
    <li>Propositional Logic vs. First Order Logic
    </li>
</ul>
<h6>Python Tools for ML
</h6>
<br>
<a href="https://machinelearningmastery.com/blog">Blog (machinelearningmastery.com)</a><br>
<a href="https://towardsdatascience.com/">Towards Data Science</a><br>
<br>
<ul>
    <li>Pytorch - Different types of Neural Networks
    </li>
    <li>Tensorflow/Keras</li>
    <li>SkLearn - other ML Models
    </li>
    <li>Huggingface - pretrained language models
    </li>
    <li>Spacy, NLTK - NLP tools
    </li>
</ul>
<h6>Linear Algebra and Stats</h6>
<br>
<a href="http://students.aiu.edu/submissions/profiles/resources/onlineBook/Y5B7M4_Introduction_to_Linear_Algebra-_Fourth_Edition.pdf">Introduction to Linear Algebra, 4th Edition (aiu.edu)</a><br>
<a href="www.seyedkalali.com/wp-content/uploads/2016/11/A-First-Course-in-Probability-8th-ed.-Sheldon-Ross.pdf">A First Course in Probability: Sheldon Ross</a><br>
<a href="http://powerunit-ju.com/wp-content/uploads/2016/11/Book-Peebles-Probability_-Random-Variables-and-Random-Signal-Principles-2ed.pdf">Probability, Random Variables, Random Signal Principles: Peyton Z Peebles</a><br>
<br>                
<ul>
    <li>Bayesian stuff
    </li>
    <li>Joint Probability
    </li>
    <li>Correlation and Covariance
    </li>
    <li>Conditional Probability and Independence
    </li>
    <li>Multivariate Random Variable
    </li>
    <li>Expectation, Binomial RV, Gaussian RV, Poisson RV
    </li>
    <li>Identity, Inverse, Diagonal, Orthogonal, Orthonormal matrices
    </li>
    <li>Eigen Values and Eigen Vectors
    </li>
    <li>EigenDecomposition</li>
    <li>Singular Value Decomposition
    </li>
    <li>Sampling data
    </li>
    <li>Maximum Likelihood Estimates
    </li>
    <li>Maximum A-Posteriori Estimate 
    </li>
    <li>Bias-Variance Tradeoffs
    </li>
    <li>Hypothesis Testing and Statistical Significance
    </li>
</ul>
<h6>Handling Text</h6>
<br>
<a href="https://nlp.stanford.edu/IR-book/pdf/irbookonlinereading.pdf">Introduction to Information Retrieval (stanford.edu)</a><br>
<a href="https://towardsdatascience.com/pagerank-algorithm-fully-explained-dc794184b4af">PageRank algorithm, fully explained | by Amrani Amine | Towards Data Science</a><br>
<a href="https://stanford.edu/~shervine/teaching/cs-230/cheatsheet-recurrent-neural-networks">CS 230 - Recurrent Neural Networks Cheatsheet (stanford.edu)</a><br>
<br>
<ul>
    <li>Representing text - Term Frequency, Inverse Document Frequency
    </li>
    <li>Bigrams, Tri-grams
    </li>
    <li>Vector Space Model
    </li>
    <li>Inverted Index - What is it, how is it useful for querying large text corpora
    </li>
    <li>Minimum edit distance - how to deal with spelling mistakes while querying text (Not ML)
    </li>
    <li>Page Rank Algorithm for Google page ranking (Not ML, tangentially related to text ML)
    </li>
    <li>Dimensionality reduction - Principal Component Analysis (PCA)
    </li>
    <li>Latent Semantic Indexing
    </li>
    <li>Contextualized word representation  (Meaning changes with context - bear:animal, bear:tolerate) - Word2Vec, BERT, GPT-2, GPT-3, ChatGPT, BARD, Bing AI
    </li>
    <li>Glove embeddings - static embeddings for words
    </li>
    <li>Non-Negative Matrix Factorization - optimization problem with Frobenius norm
    </li>
    <li>Recurrent Neural Networks - Image Captioning, Language translation
    </li>
    <li>LSTM, GRU 
    </li>
</ul>
<h6>Handling Graphs and Networks
</h6>
<ul>
    <li>Walks, Paths, Euler circuit, Hamiltonian Circuit, Degrees
    </li>
    <li>Connected graph, Directed Acyclic Graph, Bipartite Graph, Tree
    </li>
    <li>Reciprocity, transitivity
    </li>
    <li>Clustering Coefficient
    </li>
    <li>Graph Neural Networks</li>
    <li>Random Networks - Erdos Renyi
    </li>
    <li>Six Degrees of Separation
    </li>
    <li>Power Law degree distribution
    </li>
    <li>Homophily
    </li>
    <li>Watts and Strogatz network
    </li>
    <li>Barabasi Albert Network
    </li>
    <li>Scale Free Networks
    </li>
    <li>Zipf Law
    </li>
    <li>Communities in graphs, cliques, clustering - hierarchical, Girvan Neumann, Louvain, Clique Percolation
    </li>
</ul>
<h6>Game Theory</h6>
<br>
<a href="https://faculty.econ.ucdavis.edu/faculty/bonanno/GT_Book.html">Game Theory textbook (ucdavis.edu)</a><br>
<a href="https://towardsdatascience.com/game-theory-in-artificial-intelligence-57a7937e1b88">Game Theory in Artificial Intelligence | by Pier Paolo Ippolito | Towards Data Science</a><br>
<br>
<ul>
    <li>Utility function, payoff function, Reinforcement Learning, Q-Learning
    </li>
    <li>Strict Dominance, weak dominance
    </li>
    <li>Prisoner’s Dilemma, Pareto Superior, Pareto Optimal
    </li>
    <li>Strictly dominated strategy vs. Weakly dominated Strategy
    </li>
    <li>Nash Equilibrium, Pareto Optimal, Social Optimal
    </li>
    <li>Hawk-Dove Games
    </li>
    <li>Mixed Strategies
    </li>
</ul>
<h6>Machine Learning beyond Neural Networks (Scikit-Learn)</h6>
<br>
<a href="https://towardsdatascience.com/support-vector-machine-introduction-to-machine-learning-algorithms-934a444fca47">Support Vector Machine — Introduction to Machine Learning Algorithms | by Rohith Gandhi | Towards Data Science</a><br>
<a href="https://towardsdatascience.com/naive-bayes-classifier-81d512f50a7c">Naive Bayes Classifier. What is a classifier? | by Rohith Gandhi | Towards Data Science</a><br>
<a href="https://towardsdatascience.com/markov-and-hidden-markov-model-3eec42298d75">Hidden Markov Model. Elaborated with examples | Towards Data Science</a><br>
<br>
<b>Support Vector Machines</b><br>
<ul>
    <li>What is a margin in classification
    </li>
    <li>What are support vectors?
    </li>
    <li>Primal Function, max margin
    </li>
    <li>Min-max of Lagrangian
    </li>
    <li>Adding a slack variable to allow non-separable datasets
    </li>
    <li>Projecting to higher dimensions 
    </li>
    <li>Kernel Function
    </li>
    <li>Multi-class SVM  - one vs. one, one-vs-rest
    </li>
</ul>
<b>Naive Bayes Classifier
</b>
<ul>
    <li>Probabilistic classification
    </li>
    <li>Likelihood
    </li>
    <li>MLE</li>
    <li>Laplace Smoothing and Laplace Correction
    </li>
</ul>
<b>Decision Trees and Random Forests
</b><br>
<ul>
    <li>Entropy and Information Gain
    </li>
    <li>Gini Gain
    </li>
    <li>Pruning to prevent Overfitting, Post Pruning
    </li>
    <li>Reduced Error Pruning
    </li>
    <li>K-Fold Cross Validation 
    </li>
    <li>ID3 Algorithm
    </li>
</ul>
<b>K-Nearest Neighbors</b><br>
<ul>
    <li>What is a nearest neighbor
    </li>
    <li>Euclidean Distance, Manhattan Distance, Mahalanobis Distance
    </li>
    <li>1NN vs K-NN
    </li>
</ul>
<b>Logistic Regression
</b><br>
<b> Ensemble Learning</b>
<ul>
    <li>Ensemble Learning
    </li>
    <li>Boosting and Bagging
    </li>
    <li>AdaBoost Algorithm
    </li>
    <li>Random Forests
    </li>
</ul>
<b>Clustering</b><br>
<ul>
    <li>K-Means Clustering
    </li>
    <li>Unsupervised learning
    </li>
    <li>How to cluster based on centroids
    </li>
    <li>Hierarchical Clustering
    </li>
    <li>Probabilistic Clustering
    </li>
    <li>Gaussian Mixture Models
    </li>
</ul>
<b> Hidden Markov Models</b><br>
<ul>
    <li>Hidden Markov Models
    </li>
    <li>Markov Chains
    </li>
    <li>Discrete Markov processes
    </li>
    <li>Viterbi Algorithm
    </li>
    <li>Baum Welch Algorithm
    </li>
    <li>Markov Chain Monte CarloP
    </li>
</ul>
<b>Market Basket Analysis
</b><br>
<ul>
    <li>Expectation Maximization
    </li>
    <li>Estimating when data is hidden
    </li>
    <li>Purity
    </li>
    <li>Normalized Mutual Information Gain
    </li>
</ul>
<b>Genetic Algorithms</b><br>
<b>Particle Swarm Optimization</b><br>

<h5> Advanced Topics</h5>
<h6>Advanced Math/algorithms for “Learning”</h6>
<br>
<a href="https://rajsain.files.wordpress.com/2013/11/randomized-algorithms-motwani-and-raghavan.pdf">randomized-algorithms-motwani-and-raghavan.pdf (wordpress.com)</a><br>
<a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf">Convex Optimization: Boyd Vandenberghe</a><br>
<br>
<ul>
<li>What is a convex function
</li>
<li>Jensen's Inequality
</li>
<li>Convex Optimization
</li>
<li>Smooth Optimization
</li>
<li>Min-Cut Algorithm, Las Vegas and Monte Carlo Algorithms
</li>
<li>Markov and Chebyshev Inequalities
</li>
<li>Concentration Bounds - Chernoff, Hoeffdings
</li>
<li>Max Sat Problems, Expanding Graphs
</li>
<li>Lovasz Local Lemma
</li>
<li>Fingerprinting and Frievalds
</li>
<li>Submodularity
</li>
<li>Monotone Functions
</li>
<li>Hessians, Cauchy Schwartz Inequality
</li>
<li>Constrained Optimization vs. Unconstrained Optimization
</li>
<li>Pseudo Inverse of a matrix
</li>
<li>Explainability - LIME and SHAP Functions
</li>
</ul>
<h6>More ML Topics</h6>
<br>
<a href="https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf">Pattern Recognition and Machine Learning (microsoft.com)</a><br>
<br>

<ul>
<li>Hypothesis Space, Instance Space
</li>
<li>Version Space
</li>
<li>Inductive Bias, Expressivity, Decision Boundaries
</li>
<li>Mistake Bound Learning
</li>
<li>Polynomial Kernels, Gaussian Kernels
</li>
<li>Empirical Risk Minimization
</li>
<li>Sub Gradient Descent
</li>
<li>PAC Learning - Probably Approximately Correct
</li>
<li>K-CNF
</li>
<li>Agnostic Learning
</li>
<li>VC Dimensions - Shattering
</li>
</ul>
<h6>Current Research Topics</h6>
<br>
<a href="https://towardsdatascience.com/attention-and-transformer-models-fe667f958378">Attention and Transformer Models. “Attention Is All You Need” was a… | by Helene Kortschak | Towards Data Science</a><br>
<a href="https://towardsdatascience.com/what-are-stable-diffusion-models-and-why-are-they-a-step-forward-for-image-generation-aa1182801d46">What are Stable Diffusion Models and Why are they a Step Forward for Image Generation? | by J. Rafid Siddiqui, PhD | Towards Data Science
</a><br>
<a href="https://shashank7-iitd.medium.com/understanding-vector-quantized-variational-autoencoders-vq-vae-323d710a888a">Understanding Vector Quantized Variational Autoencoders (VQ-VAE) | by Shashank Yadav | Medium</a><br>
<a href="https://zongyi-li.github.io/neural-operator/">Neural Operator (zongyi-li.github.io)</a><br>
<a href="https://www.matthewtancik.com/nerf">NeRF: Neural Radiance Fields (matthewtancik.com)</a><br>
<a href="https://ps.is.mpg.de/~black">Michael Black | Perceiving Systems - Max Planck Institute for Intelligent Systems (mpg.de)</a><br>
<a href="https://distill.pub/">Distill - Machine Learning Journal 2016-2021 </a><br>
<br>        
<ul>
<li>Transformers - Attention based models, Cross attention
</li>
<li>Sparse Transformers - Learning vs. Memorization
</li>
<li>Stable Diffusion
</li>
<li>Neural Operators
</li>
<li>VQ-VAE
</li>
<li>Cross Modal Learning
</li>
<li>Neural Radiance Fields (NERF)
</li>
<li>Mel-Spectrograms Synthesis through Diffusion</li>
<li>Learning Embeddings
</li>
</ul>
</div>
</div>
</div>

