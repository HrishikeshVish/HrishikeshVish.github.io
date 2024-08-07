---
layout: page
title: project 1
description: a project with a background image
img: assets/img/12.jpg
importance: 1
category: work
related_publications: einstein1956investigations, einstein1950meaning
---
<script async src="https://www.googletagmanager.com/gtag/js?id=G-EWRYSDM25P"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-EWRYSDM25P');
</script>

<link href="https://fonts.googleapis.com/css?family=Google+Sans|Noto+Sans|Castoro"
rel="stylesheet">
<link rel="icon" href="static/figures/icon2.png">

<link rel="stylesheet" href="static/css/bulma.min.css">
<link rel="stylesheet" href="static/css/bulma-carousel.min.css">
<link rel="stylesheet" href="static/css/bulma-slider.min.css">
<link rel="stylesheet" href="static/css/fontawesome.all.min.css">
<link rel="stylesheet"
href="https://cdn.jsdelivr.net/gh/jpswalsh/academicons@1/css/academicons.min.css">
<link rel="stylesheet" href="static/css/index.css">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://documentcloud.adobe.com/view-sdk/main.js"></script>
<script defer src="static/js/fontawesome.all.min.js"></script>
<script src="static/js/bulma-carousel.min.js"></script>
<script src="static/js/bulma-slider.min.js"></script>
<script src="static/js/index.js"></script>
</head>

<body>


<section class="publication-header">
<div class="hero-body">
<div class="container is-max-widescreen">
<!-- <div class="columns is-centered"> -->
<div class="column has-text-centered">
<h4 class="title is-3 publication-title">AffectEcho: Speaker Independent and Language-Agnostic Emotion and Affect Transfer for Speech Synthesis</h4>
<div class="is-size-3 publication-authors">
Preprint (Arxiv)
</div>
</div>
</div>
</div>

</section>

<section class="publication-author-block">
<div class="hero-body">
<div class="container is-max-desktop">
<div class="columns is-centered">
<div class="column has-text-centered">
<div class="is-size-5 publication-authors">
<span class="author-block"><a href="https://hrishikeshvish.github.io/" target="_blank">Hrishikesh Viswanath</a>,</span>
<span class="author-block"><a href="" target="_blank">Aneesh Bhattacharya</a>,</span>
<span class="author-block"><a href="" target="_blank">Pascal Jutras-Dube</a>,</span>
<span class="author-block"><a href="" target="_blank">Prerit Gupta</a>,</span>
<span class="author-block"><a href="" target="_blank">Mridu Prashanth</a></span>,</span>
<span class="author-block"><a href="" target="_blank">Yashvardhan Khaitan</a>
<span class="author-block"><a href="" target="_blank">Aniket Bera</a>


</div>

<div class="is-size-5 publication-authors">
<span class="author-block">Purdue University, West Lafayette, IN, USA</span> 
<!-- <span class="eql-cntrb"><small><br><sup>*</sup>Indicates Equal Contribution</small></span> -->
</div>



<div class="column has-text-centered">
<div class="publication-links">
<span class="link-block">
<a href="https://arxiv.org/pdf/2308.08577.pdf" target="_blank"
class="external-link button is-normal is-rounded">
<span class="icon">
<i class="ai ai-arxiv"></i>
</span>
<span>arXiv</span>
</a>
</span>


<!-- PDF Link. -->
<!--              <span class="link-block">-->
<!--                <a href="static/source/MotionCLIP.pdf" target="_blank"-->
<!--                  class="external-link button is-normal is-rounded">-->
<!--                  <span class="icon">-->
<!--                    <i class="fas fa-file-pdf"></i>-->
<!--                  </span>-->
<!--                  <span>Paper</span>-->
<!--                </a>-->
<!--              </span>-->
<!--                            </span>-->
<!-- </span> -->
<!-- Colab Link. -->
<span class="link-block">
<a href="https://github.com/IDEAS-Lab-Purdue/AffectEcho" target="_blank"
class="external-link button is-normal is-rounded">
<span class="icon">
<i class="fab fa-github"></i>
</span>
<span>Code</span>
</a>

</span>

<span class="link-block">
<a href="" target="_blank"
class="external-link button is-normal is-rounded">
<span class="icon">
<i class="fas fa-rocket"></i>
</span>
<span>Demo</span>
</a>

</span>
<!-- </span> -->
<!-- Colab Link. -->
</div>
</div>

</div>
</div>
</div>
</div>
</section>

<!-- 
<section class="hero is-small">
<!~~ <div class="hero-body"> ~~>
<section class="hero teaser">
<div class="container is-max-desktop">
<div class="hero-body">
<!~~ <div id="results-carousel" class="carousel results-carousel"> ~~>
<div class="container">
<div class="item">
<div class="column is-centered has-text-centered">
<img src="static/figures/teaser.png" alt="MotionCLIP"/>
</div>

</div>
</div>
<!~~  </div> ~~>
</div>
</div>
<!~~  </div> ~~>
</section>
-->

<section class="section hero is-light">
<div class="container is-max-desktop">
<!-- Abstract. -->
<div class="columns is-centered has-text-centered">
<div class="column is-four-fifths">
<div class="item">
<p style="margin-bottom: 30px">
<!-- 
<video poster="" id="tree" autoplay controls muted loop height="100%">
<source src="static/figures/MDM-page.mp4"
type="video/mp4">
</video>
-->
<iframe width="720" height="405" src="https://www.youtube.com/embed/cEwHUEr9nLg?si=2aVtd6KIxRKKagP3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>
</div>
<h2 class="title is-3">Abstract</h2>
<div class="content has-text-justified">
<p>
Affect is an emotional characteristic encompassing valence, arousal, and intensity, and is a crucial attribute for enabling
authentic conversations. While existing text-to-speech (TTS) and speech-to-speech systems rely on strength embedding
vectors and global style tokens to capture emotions, these models represent emotions as a component of style or represent them in discrete categories. We propose AffectEcho,
an emotion translation model, that uses a Vector Quantized
codebook to model emotions within a quantized space featuring five levels of affect intensity to capture complex nuances and subtle differences in the same emotion. The quantized emotional embeddings are implicitly derived from spoken speech samples, eliminating the need for one-hot vectors
or explicit strength embeddings. Experimental results demonstrate the effectiveness of our approach in controlling the
emotions of generated speech while preserving identity, style,
and emotional cadence unique to each speaker. We showcase the language-independent emotion modeling capability
of the quantized emotional embeddings learned from a bilingual (English and Chinese) speech corpus with an emotion
transfer task from a reference speech to a target speech. We
achieve state-of-art results on both qualitative and quantitative metrics.</p>
</div>
</div>
</div>
<!--/ Abstract. -->
</div>
</section>



<section class="hero is-small">
<div class="hero-body">
<div class="container">

<div class="column is-centered has-text-centered">
<img src="static/figures/AffectEcho.png" alt="cars peace"/>
</div>


</div>
</div>
</div>
</section>


<section class="section hero is-light">
<div class="container is-max-desktop">
<!-- Abstract. -->
<div class="columns is-centered has-text-centered">
<div class="column is-four-fifths">
<!--         <h2 class="title is-3">How does it work?</h2> -->
<div class="content has-text-justified">
<p>
Vector quantized embeddings
are, in a broad sense, interpretable; however, the individual
features of the 64-feature vector representing the quantized
emotion cannot be tuned manually to translate the emotion.
The use of quantized vectors ensures that out-of-distribution
speech samples are still mapped to the nearest known em-
beddings, preserving the robustness and generalization ca-
pacity of the emotion representation.
AffectEcho performs well in cross-language
settings and accurately mapps similar emotions together,
across languages. AffectEcho has an overall lower MCD score compared to 
other state of the art models. Furthermore,
while the other models generate emotional speech with good
accuracy, they fail to incorporate affective features from the
human speaker, with whom they are interacting. AffectEcho
aims to bridge this gap and showcase stronger human-AI in-
teraction capabilities by capturing variations in valence, arousal and dominance.
</p>
<div class="columns is-centered has-text-centered">
<div class="item">
<p style="margin-bottom: 30px">
<!--
<video poster="" id="tree" autoplay controls muted loop height="100%">
<source src="static/figures/MDM-page.mp4"
type="video/mp4">
</video>
--><br><br>

</p>
</div>
</div>
</div>
</div>
</div>
<!--/ Abstract. -->
</div>
</section> 


<!-- 
<section class="hero is-small">
<div class="hero-body">
<div class="container">

<div class="column is-centered has-text-centered">
<img src="static/figures/sampling.png" alt="cars peace"/>
</div>


</div>
</div>
</div>
</section>
-->
<section style="margin-top:25px;">
<div class="container is-max-desktop">
<!-- Abstract. -->
<div class="columns is-centered has-text-centered">
<div class="column is-four-fifths">
<h2 class="title is-3">English with English reference</h2>
<p>
The following section demonstrates the model's ability to translate emotions in English language, when the reference
is in English. 
</p>
</div>
</div>
</div>
<!--/ Abstract. -->
</div>
</section> 


<table style="height:100px; align-self: center; margin-left: 15%; width: 66%;margin-top: 85px; border-collapse: separate; border-spacing:20px;">
<tbody>
<tr>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Source</h4></td>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Reference Audio</h4></td>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Output</h4></td>
</tr>

<tr style="margin-top:20px; padding:10px;">
<th colspan=3 style="text-align: center; "><h8>Neutral-to-Angry</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_0_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_0_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_0_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_3_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_3_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_3_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Happy</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_0_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_0_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_0_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_1_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_1_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_1_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Sad</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_0_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_0_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_0_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_2_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_2_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_2_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Surprise</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_0_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_0_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_0_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_1_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_1_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_1_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
</tbody>

</table>







<section class="section hero is-light">
<div class="container is-max-desktop">
<!-- Abstract. -->
<div class="columns is-centered has-text-centered">
<div class="column is-four-fifths">
<h2 class="title is-3">English with Chinese Reference</h2>
<p>
The following section demonstrates the model's ability to translate emotions in English language, when the reference
is in Chinese. 
</p>
</div>
</div>
</div>
<!--/ Abstract. -->
</div>
</section> 

<table style="height:100px; align-self: center; margin-left: 15%; width: 66%;margin-top: 85px; border-collapse: separate; border-spacing:20px;">
<tbody>
<tr>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Source</h4></td>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Reference Audio</h4></td>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Output</h4></td>
</tr>

<tr style="margin-top:20px; padding:10px;">
<th colspan=3 style="text-align: center; "><h8>Neutral-to-Angry</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_6_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_6_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_6_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_9_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_9_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/angry_9_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Happy</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_6_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_6_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_6_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_9_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_9_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/happy_9_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>

<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Sad</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_6_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_6_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_6_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_7_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_7_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/sad_7_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Surprise</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_6_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_6_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_6_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_10_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_10_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Eng-to-Eng/surprise_10_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
</tbody>

</table>

<section class="section hero is-light">
<div class="container is-max-desktop">
<!-- Abstract. -->
<div class="columns is-centered has-text-centered">
<div class="column is-four-fifths">
<h2 class="title is-3">Chinese with Chinese Reference</h2>
<p>
The following section demonstrates the model's ability to translate emotions in Chinese language, when the reference
is in Chinese. 
</p>
</div>
</div>
</div>
<!--/ Abstract. -->
</div>
</section> 

<table style="height:100px; align-self: center; margin-left: 15%; width: 66%;margin-top: 85px; border-collapse: separate; border-spacing:20px;">
<tbody>
<tr>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Source</h4></td>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Reference Audio</h4></td>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Output</h4></td>
</tr>

<tr style="margin-top:20px; padding:10px;">
<th colspan=3 style="text-align: center; "><h8>Neutral-to-Angry</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_0_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_0_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_0_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_1_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_1_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_1_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Happy</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_0_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_0_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_0_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_1_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_1_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_1_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Sad</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_0_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_0_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_0_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_1_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_1_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_1_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Surprise</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_0_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_0_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_0_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_1_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_1_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_1_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
</tbody>

</table>




<section class="section hero is-light">
<div class="container is-max-desktop">
<!-- Abstract. -->
<div class="columns is-centered has-text-centered">
<div class="column is-four-fifths">
<h2 class="title is-3">Chinese with English Reference</h2>
<p>
The following section demonstrates the model's ability to translate emotions in Chinese language, when the reference
is in English. 
</p>
</div>
</div>
</div>
<!--/ Abstract. -->
</div>
</section> 

<table style="height:100px; align-self: center; margin-left: 15%; width: 66%;margin-top: 85px; border-collapse: separate; border-spacing:20px;">
<tbody>
<tr>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Source</h4></td>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Reference Audio</h4></td>
<td style="text-align: center; width:100px;"><h4 class="title is-5 publication-title">Output</h4></td>
</tr>

<tr style="margin-top:20px; padding:10px;">
<th colspan=3 style="text-align: center; "><h8>Neutral-to-Angry</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_6_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_6_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_6_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_7_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_7_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/angry_7_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Happy</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_6_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_6_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_6_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_7_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_7_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/happy_7_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Sad</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_6_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_6_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_6_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_7_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_7_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/sad_7_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>
<th colspan=3 style="text-align: center;"><h8>Neutral-to-Surprise</h8></th>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_6_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_6_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_6_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
<tr>

<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_7_model_input_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_7_reference_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>
</td>
<td>
<audio controls>
<source src="affectecho_data/Chi-to-Chi/surprise_7_output_.wav" type="audio/wav" />
Your browser does not support the audio element.
</audio>

</td>
</tr>
</tbody>

</table>



<section class="section" id="BibTeX">
<div class="container is-max-desktop content">
<h2 class="title">BibTeX</h2>
<pre><code>
@article{viswanath2023affectecho,
title={AffectEcho: Speaker Independent and Language-Agnostic Emotion and Affect Transfer for Speech Synthesis},
author={Viswanath, Hrishikesh and Bhattacharya, Aneesh and Jutras-Dub{\'e}, Pascal and Gupta, Prerit and Prashanth, Mridu and Khaitan, Yashvardhan and Bera, Aniket},
journal={arXiv preprint arXiv:2308.08577},
year={2023}
}</code></pre>
</div>
</section>




<footer class="footer">
<!--  <div class="container">
<div class="content has-text-centered">
<a class="icon-link"
href="https://homes.cs.washington.edu/~kpar/nerfies/videos/nerfies_paper.pdf">
<i class="fas fa-file-pdf"></i>
</a>
<a class="icon-link" href="https://github.com/keunhong" class="external-link" disabled>
<i class="fab fa-github"></i>
</a>
</div> -->
<div class="columns is-centered">
<div class="column is-8">
<div class="content">
<p>
This website is licensed under a <a rel="license"
href="http://creativecommons.org/licenses/by-sa/4.0/">Creative
Commons Attribution-ShareAlike 4.0 International License</a>.
</p>
<p>
Website source code based on the <a href="https://nerfies.github.io/"> Nerfies</a> project page. If you want to reuse their <a
href="https://github.com/nerfies/nerfies.github.io">source code</a>, please credit them appropriately.
</p>
</div>
</div>
</div>
</div>
</footer>


<script type="text/javascript">
var sc_project=12351448; 
var sc_invisible=1; 
var sc_security="c676de4f"; 
</script>
<script type="text/javascript"
src="https://www.statcounter.com/counter/counter.js"
async></script>
<noscript><div class="statcounter"><a title="Web Analytics"
href="https://statcounter.com/" target="_blank"><img
class="statcounter"
src="https://c.statcounter.com/12351448/0/c676de4f/1/"
alt="Web Analytics"></a></div></noscript>
<!-- End of Statcounter Code -->






Every project has a beautiful feature showcase page.
It's easy to include images in a flexible 3-column grid format.
Make your photos 1/3, 2/3, or full width.

To give your project a background in the portfolio page, just add the img tag to the front matter like so:

---
layout: page
title: project
description: a project with a background image
img: /assets/img/12.jpg
---

<div class="row">
<div class="col-sm mt-3 mt-md-0">
{% include figure.html path="assets/img/1.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
</div>
<div class="col-sm mt-3 mt-md-0">
{% include figure.html path="assets/img/3.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
</div>
<div class="col-sm mt-3 mt-md-0">
{% include figure.html path="assets/img/5.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
</div>
</div>
<div class="caption">
Caption photos easily. On the left, a road goes through a tunnel. Middle, leaves artistically fall in a hipster photoshoot. Right, in another hipster photoshoot, a lumberjack grasps a handful of pine needles.
</div>
<div class="row">
<div class="col-sm mt-3 mt-md-0">
{% include figure.html path="assets/img/5.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
</div>
</div>
<div class="caption">
This image can also have a caption. It's like magic.
</div>

You can also put regular text between your rows of images.
Say you wanted to write a little bit about your project before you posted the rest of the images.
You describe how you toiled, sweated, *bled* for your project, and then... you reveal its glory in the next row of images.


<div class="row justify-content-sm-center">
<div class="col-sm-8 mt-3 mt-md-0">
{% include figure.html path="assets/img/6.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
</div>
<div class="col-sm-4 mt-3 mt-md-0">
{% include figure.html path="assets/img/11.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
</div>
</div>
<div class="caption">
You can also have artistically styled 2/3 + 1/3 images, like these.
</div>


The code is simple.
Just wrap your images with `<div class="col-sm">` and place them inside `<div class="row">` (read more about the <a href="https://getbootstrap.com/docs/4.4/layout/grid/">Bootstrap Grid</a> system).
To make images responsive, add `img-fluid` class to each; for rounded corners and shadows use `rounded` and `z-depth-1` classes.
Here's the code for the last row of images above:

{% raw %}
```html
<div class="row justify-content-sm-center">
<div class="col-sm-8 mt-3 mt-md-0">
{% include figure.html path="assets/img/6.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
</div>
<div class="col-sm-4 mt-3 mt-md-0">
{% include figure.html path="assets/img/11.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
</div>
</div>
```
{% endraw %}
