import trainingPage1_480 from "sellnautix-media:training-page-1-480.webp";
import trainingPage1_800 from "sellnautix-media:training-page-1-800.webp";
import trainingPage2_800 from "sellnautix-media:training-page-2-800.webp";
import trainingPage3_640 from "sellnautix-media:training-page-3-640.webp";
import trainingPage3_960 from "sellnautix-media:training-page-3-960.webp";
import trainingPage4_800 from "sellnautix-media:training-page-4-800.webp";
import trainingPage4_1200 from "sellnautix-media:training-page-4-1200.webp";
import trainingPage7_480 from "sellnautix-media:training-page-7-480.webp";
import trainingPage7_960 from "sellnautix-media:training-page-7-960.webp";
import ajayMehta from "sellnautix-media:linkedin-recommendations-ajay-mehta-480.webp";
import munishSaini from "sellnautix-media:linkedin-recommendations-munish-saini-480.webp";
import hasinaShaikh from "sellnautix-media:linkedin-recommendations-hasina-shaikh-480.webp";
import abdulRahman from "sellnautix-media:linkedin-recommendations-abdul-rahman-480.webp";
import reflectoSafe from "sellnautix-media:linkedin-recommendations-reflecto-safe-480.webp";

const responsive = (src, srcSet, sizes, width, height) => ({ src, srcSet, sizes, width, height });

export const trainingMedia = {
  page1: responsive(trainingPage1_800, `${trainingPage1_480} 480w, ${trainingPage1_800} 800w`, "(max-width: 800px) calc(100vw - 48px), 300px", 800, 1131),
  page2: { src: trainingPage2_800, width: 800, height: 1131 },
  page3: responsive(trainingPage3_960, `${trainingPage3_640} 640w, ${trainingPage3_960} 960w`, "(max-width: 800px) calc(100vw - 48px), 500px", 960, 720),
  page4: responsive(trainingPage4_1200, `${trainingPage4_800} 800w, ${trainingPage4_1200} 1200w`, "(max-width: 800px) calc(100vw - 48px), 700px", 1200, 900),
  page7: responsive(trainingPage7_960, `${trainingPage7_480} 480w, ${trainingPage7_960} 960w`, "(max-width: 800px) calc(100vw - 48px), 520px", 960, 720)
};

export const linkedinMedia = [
  { id: "ajay-mehta", src: ajayMehta, width: 480, height: 150 },
  { id: "munish-saini", src: munishSaini, width: 480, height: 120 },
  { id: "hasina-shaikh", src: hasinaShaikh, width: 480, height: 153 },
  { id: "abdul-rahman", src: abdulRahman, width: 480, height: 112 },
  { id: "reflecto-safe", src: reflectoSafe, width: 480, height: 329 }
];
