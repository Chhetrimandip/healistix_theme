/* Small explanatory drawings; decorative alongside complete text labels. */
const paths = {
  sun:'<circle cx="20" cy="20" r="7"/><path d="M20 3v5m0 24v5M3 20h5m24 0h5M8 8l4 4m16 16 4 4M8 32l4-4m16-16 4-4"/>',
  bowl:'<path d="M6 20h28c-1 10-7 14-14 14S7 30 6 20ZM13 6c-4 4 4 5 0 10m8-10c-4 4 4 5 0 10m8-10c-4 4 4 5 0 10"/>',
  leaf:'<path d="M8 32C-1 13 15 7 33 7c0 18-6 31-25 25Zm0 0L27 13m-9 9v-8m0 8h9"/>',
  moon:'<path d="M28 29A15 15 0 0 1 13 5a15 15 0 1 0 22 22c-2 1-4 2-7 2ZM29 5v8m-4-4h8"/>',
  focus:'<circle cx="20" cy="20" r="13"/><circle cx="20" cy="20" r="6"/><path d="M20 3v6m0 22v6M3 20h6m22 0h6"/>',
  sparkle:'<path d="m18 6 4 10 10 4-10 4-4 10-4-10-10-4 10-4ZM31 4v7m-3-3h6"/>',
  breeze:'<path d="M4 14h22c10 0 10-11 3-11-4 0-5 3-5 5M4 21h30M4 28h18c10 0 10 10 3 10-4 0-5-3-5-5"/>',
  cycle:'<path d="M8 16A13 13 0 0 1 32 13l2 5m0-10v10H24M32 25A13 13 0 0 1 8 28l-2-5m0 10V23h10"/>',
  movement:'<circle cx="24" cy="7" r="3"/><path d="m10 17 9-5 8 7h7M19 12l-5 14-8 7m8-7 10 2 6 8"/>',
  weights:'<path d="M13 20h14M6 11h7v18H6ZM27 11h7v18h-7ZM3 16v8m34-8v8"/>',
  drop:'<path d="M20 4S7 18 7 25a13 13 0 0 0 26 0C33 18 20 4 20 4Zm-7 21c0 5 3 7 7 7"/>',
  sprout:'<path d="M20 35V20C9 20 5 15 5 7c10 0 15 4 15 13Zm0 5C20 11 27 7 35 7c0 11-6 18-15 18M12 35h16"/>',
  heart:'<path d="M20 33 6 20C-4 9 11 1 20 12 29 1 44 9 34 20Z"/>',
  medicine:'<path d="m12 7 21 21c8 8-3 18-11 10L1 17C-7 9 4-1 12 7Z" transform="translate(5 0) scale(.8)"/><path d="m13 25 12-12"/>',
  person:'<circle cx="20" cy="11" r="6"/><path d="M7 35v-6a13 13 0 0 1 26 0v6"/>',
  jar:'<path d="M11 8h18v5H11ZM10 13h20l2 6v16H8V19ZM8 23h24"/>',
  berry:'<circle cx="14" cy="25" r="8"/><circle cx="27" cy="25" r="8"/><circle cx="20" cy="15" r="8"/><path d="m16 6 4 4 5-5"/>',
  fruit:'<path d="M20 12C3 5 2 33 16 35l4-2 4 2c14-2 13-30-4-23Zm0 0c-1-7 4-9 9-9-1 6-5 8-9 9Z"/>',
  citrus:'<circle cx="20" cy="21" r="14"/><circle cx="20" cy="21" r="10"/><path d="M20 11v20M10 21h20m-17-7 14 14m0-14L13 28"/>',
  flower:'<path d="M20 16C6-3 0 18 14 20-5 34 17 40 20 26c14 19 22-3 6-6C45 6 23 0 20 16Z"/><circle cx="20" cy="21" r="4"/>',
  banana:'<path d="M31 5C32 24 20 33 5 26c6 15 33 8 30-17Zm0 0 4 4M9 28c12 5 22-3 24-15"/>',
  mango:'<path d="M29 9C17 2 4 16 7 28c2 10 16 10 23 0 5-7 5-16-1-19ZM24 8c0-5 5-6 10-5-2 4-5 6-10 5M12 27c0-6 3-11 8-14"/>',
  pineapple:'<path d="m15 13-5-9 9 6 2-8 3 8 8-6-5 10M20 13c-17 0-16 24 0 24s17-24 0-24ZM11 18l17 14M10 26l11 10M17 14l13 11M28 18 12 32m18-6-10 10m3-22L10 25"/>',
  strawberry:'<path d="M7 15c-4 7 8 21 13 22 5-1 17-15 13-22-4-6-22-6-26 0Zm6-3-2-6 9 5 8-6-2 7m-6-1V4M13 18v1m8-2v1m7 2v1m-11 4v1m6 1v1m-4 4v1"/>',
  melon:'<path d="M4 13h32C33 39 7 39 4 13Zm4 0c3 21 21 21 24 0M13 18l1 3m6-3v4m7-4-1 3"/>',
  peach:'<path d="M20 13C6 2-1 23 11 33c5 5 9 0 9 0s5 5 10 0c11-10 6-30-10-20Zm0 0c-6 5-5 15 0 20m0-20c-1-6 5-9 12-7-4 6-7 7-12 7"/>',
};
const goals = {digestion:'bowl','skin-hair-nails':'sparkle',energy:'sun','vitality-men':'sprout','vitality-women':'sprout',stress:'leaf',sleep:'moon',focus:'focus',joints:'movement',greens:'leaf',cleanse:'drop',respiratory:'breeze',metabolism:'bowl','womens-balance':'cycle',recovery:'weights',mood:'sun'};
const fruits = {banana:['banana','#F6E9B4'],blueberry:['berry','#DFE4F3'],grape:['berry','#E9DDF0'],strawberry:['fruit','#F4DDD5'],'strawberry pineapple':['fruit','#F5E2C9'],orange:['citrus','#F8E4C4'],rose:['flower','#F0DDE3'],honey:['drop','#F6E9B4'],none:['jar','#E4EFF0'],mango:['fruit','#F6E4BC'],'pineapple mango':['fruit','#F6E4BC'],pineapple:['fruit','#F1E8B5'],watermelon:['fruit','#DFEBD9'],honeydew:['fruit','#E5EDD5'],lychee:['fruit','#F0DFDC'],dragonfruit:['fruit','#F2DEEB'],'passion fruit':['fruit','#EAE0F0'],peach:['fruit','#F6E0D0'],'red guava':['fruit','#F1DDD6']};
const svg = (kind,background='#E4EFF0') => `<span class="hx-builder-pictogram" style="--hx-visual-bg:${background}" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false">${paths[kind]||paths.leaf}</svg></span>`;
export function choiceVisual(name,id) {
  if(name==='use_chips'||name==='clarify')return svg(goals[id]);
  if(name==='family'){const family={tropical:['mango','#F6E4BC'],berry:['berry','#DFE4F3'],citrus:['citrus','#F8E4C4'],floral:['flower','#F0DDE3'],none:['jar','#E4EFF0']};return svg(...family[id]);}
  if(name==='flavor'){const overrides={mango:'mango',pineapple:'pineapple','pineapple mango':'pineapple',strawberry:'strawberry','strawberry pineapple':'strawberry',watermelon:'melon',honeydew:'melon',peach:'peach',lychee:'berry','passion fruit':'citrus','red guava':'peach',dragonfruit:'mango'};const [kind,color]=fruits[id]||['fruit','#F6E4BC'];return svg(overrides[id]||kind,color);}
  if(name==='strength_pref'||name==='level')return `<span class="hx-builder-amount" aria-hidden="true"><i></i><i class="${id==='strong'||id==='extra'?'is-full':''}"></i></span>`;
  if(name==='sex')return svg('sprout');
  if(name==='first_time')return svg(id==='true'?'jar':'cycle');
  if(name==='stim_sensitive')return svg(id==='true'?'breeze':'leaf');
  return '';
}
export function choiceHint(name,id){return ({strength_pref:{standard:'Standard herb amounts',strong:'Higher amounts, within the blend limits'},level:{standard:'Regular flavor level',extra:'A fuller fruit flavor'},family:{tropical:'Mango, pineapple & more',berry:'Blueberry, strawberry & more',citrus:'Orange',floral:'Rose or honey',none:'Sea moss without added flavor'}})[name]?.[id]||'';}
export function fieldVisual(name){return ({adult:'<span class="hx-builder-legend-mark" aria-hidden="true">18+</span>',pregnant_nursing:svg('person'),seaweed_iodine_allergy:svg('leaf'),conditions:svg('medicine')})[name]||'';}
