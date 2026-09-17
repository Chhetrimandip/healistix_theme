/* Hair profile: session-only, no analytics, no diagnosis or formula approval. */
(() => {
  'use strict';
  const KEY = 'hx-hair-profile-v2';
  const steps = [
    {key:'concerns',label:'What you notice',title:'What changes have you noticed in your hair?',note:'Select all that apply.',multi:true,options:[['shedding','More shedding','More hair on my brush or in the shower.'],['thinning','Less fullness','My hair looks thinner than it used to.'],['breakage','Breakage','My strands seem to snap more easily.'],['slow-growth','Less length','It feels like my hair isn’t getting longer.'],['finer-hair','Finer strands','My hair feels finer than before.']]},
    {key:'area',label:'Where you notice it',title:'Where do you notice the change most?',note:'Select the area that feels closest to your experience.',visual:true,options:[['hairline','Hairline / temples'],['part','Along my part'],['crown','At the crown'],['all-over','All over'],['unsure','I’m not sure']]},
    {key:'onset',label:'When it started',title:'When did you first notice the change?',note:'Your best estimate is enough.',options:[['recent','Within the last 3 months'],['months','3 to 12 months ago'],['year-plus','More than a year ago'],['unsure','I’m not sure']]},
    {key:'frequency',label:'How often',title:'How often are you noticing it?',note:'Think about the changes you selected at the start.',options:[['occasional','Occasionally','It comes and goes.'],['frequent','Often','I notice it several times a week.'],['consistent','Consistently','It’s something I notice most days.'],['unsure','I’m not sure','I haven’t tracked it closely.']]},
    {key:'tried',label:'What you have tried',title:'What have you tried for your hair so far?',note:'Select all that apply. Starting fresh is an answer too.',multi:true,options:[['supplements','Hair supplements'],['topicals','Topical products','For example, hair oils or scalp products.'],['routine-changes','Changes to my hair routine'],['professional-help','Advice from a professional'],['nothing','Nothing yet','I’m exploring my first step.']]},
    {key:'desiredOutcome',label:'What matters to you',title:'What would you most like to work towards?',note:'Choose your main goal. This describes what matters to you, not a promised result.',options:[['less-shedding','Less shedding'],['fullness','A fuller look'],['length','Retaining more length'],['overall-care','Overall hair care']]},
    {key:'priority',label:'Your blend priority',title:'What matters most in your blend?',note:'Choose the one that matters most to you.',options:[['ingredient-clarity','Understanding every ingredient','Tell me what’s inside and why it’s being considered.'],['simple-routine','Keeping things simple','One clear product, with clear directions.'],['personal-fit','A more personal fit','Show me how my answers shape the next step.']]},
    {key:'suitability',label:'Ingredient suitability',title:'Before we show your blend profile…',note:'This experience is for adults. Choose a review if you are under 18, pregnant or nursing, take medication, have allergies or a medical condition, or are unsure. We only save whether a review is needed.',options:[['review','I need a review, or I’m unsure','Show me the review path.'],['none','I’m 18+ and none of these apply','Continue to my hair profile.']]}
  ];
  const create=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
  const valid=(step,value)=>step.multi?Array.isArray(value)&&value.length>0&&new Set(value).size===value.length&&value.every(v=>step.options.some(o=>o[0]===v))&&!(step.key==='tried'&&value.includes('nothing')&&value.length>1):step.options.some(o=>o[0]===value);
  function photo(kind,value){
    const locations={hairline:['0% 0%','Close view of the hairline and temple'],part:['100% 0%','Close view of a centre hair part'],crown:['0% 100%','View of the crown from above'],'all-over':['100% 100%','Overall view of hair and scalp']};
    const concerns={shedding:['0% 0%','Hair strands caught in a hairbrush'],thinning:['100% 0%','A hand holding a ponytail'],breakage:['0% 100%','Loose broken hair strands'],'slow-growth':['100% 100%','Close view of hair ends'],'finer-hair':['100% 0%','A hand holding a section of fine hair']};
    const selected=(kind==='area'?locations:concerns)[value];if(!selected)return null;
    const image=create('span',kind==='area'?'hxq-location-photo':'hxq-choice-photo');image.style.backgroundPosition=selected[0];image.setAttribute('role','img');image.setAttribute('aria-label',selected[1]);return image;
  }
  function init(root){
    if(root.dataset.initialized)return;root.dataset.initialized='true';
    const answers={};let index=0,returnToReview=false;
    const content=root.querySelector('[data-step-content]'),next=root.querySelector('[data-next]'),back=root.querySelector('[data-back]'),error=root.querySelector('[data-quiz-error]'),storageNotice=root.querySelector('[data-storage-notice]');
    const preview=new URLSearchParams(window.location.search).get('preview')==='1';
    function education(){
      const card=create('aside','hxq-ingredient-card');const images=create('div','hxq-ingredient-images');
      [[root.dataset.gelImage,'Healistix unflavored sea moss gel'],[root.dataset.amlaImage,'Duals Natural Amla powder'],[root.dataset.bhringarajImage,'Duals Natural Bhringaraj powder']].forEach(([src,alt])=>{if(src){const image=create('img');image.src=src;image.alt=alt;image.width=88;image.height=102;images.append(image);}});
      const copy=create('div');copy.append(create('span','hxq-mini-label','YOUR BLEND STARTS HERE'),create('h2','','Sea moss gel. Herbal possibilities.'),create('p','','A sea moss base, enhanced with selected powders from the Duals Natural collection. Your ingredient details will stay visible as you explore.'));card.append(images,copy);return card;
    }
    function context(key){
      const label=(k)=>{const step=steps.find(s=>s.key===k);return step.options.find(o=>o[0]===answers[k])?.[1];};
      if(key==='onset'&&answers.area&&answers.area!=='unsure')return `Your focus: ${label('area')}.`;
      if(key==='frequency'&&answers.onset&&answers.onset!=='unsure')return `First noticed: ${label('onset').toLowerCase()}.`;
      if(key==='desiredOutcome'&&answers.tried?.includes('nothing'))return 'You’re exploring a first step. Let’s start with what matters to you.';
      if(key==='priority'&&answers.desiredOutcome)return `Your goal: ${label('desiredOutcome').toLowerCase()}.`;
      return '';
    }
    try{const saved=JSON.parse(sessionStorage.getItem(KEY)||'null');if(saved&&saved.version===2&&saved.goal==='hair-care'&&saved.base==='sea-moss-gel'){steps.slice(0,-1).forEach(step=>{if(valid(step,saved[step.key]))answers[step.key]=saved[step.key];});if(typeof saved.reviewRequired==='boolean')answers.suitability=saved.reviewRequired?'review':'none';}}catch(_){/* Continue in memory. Save failures are shown before navigation. */}
    function render(focus=true){
      content.replaceChildren();error.hidden=true;storageNotice.hidden=true;const review=index===steps.length;root.dataset.quizStep=review?'review':steps[index].key;
      root.querySelector('[data-step-label]').textContent=review?'Your hair profile':`Question ${index+1} of ${steps.length}`;
      const progress=root.querySelector('[role="progressbar"]');progress.setAttribute('aria-valuemax',String(steps.length));progress.setAttribute('aria-valuenow',String(index));progress.setAttribute('aria-valuetext',review?'All eight questions answered. Review your hair profile.':`Question ${index+1} of ${steps.length}`);root.querySelector('[data-progress-fill]').style.width=`${index/steps.length*100}%`;
      const title=create('h1','',review?'Let’s make sure we’ve got this right.':steps[index].title);title.tabIndex=-1;content.append(title,create('p','hxf-question-note',review?'Your blend profile starts with these answers. Change anything before you continue.':steps[index].note));
      if(!review){const response=context(steps[index].key);if(response)content.append(create('p','hxq-context',response));if(steps[index].key==='priority')content.append(education());}
      if(review){
        const summary=create('dl','hxf-review');steps.forEach((step,stepIndex)=>{const row=create('div'),edit=create('button','hxf-text-button','Change');edit.type='button';edit.setAttribute('aria-label',`Change ${step.label.toLowerCase()}`);edit.addEventListener('click',()=>{index=stepIndex;returnToReview=true;render();});const chosen=step.multi?answers[step.key]:[answers[step.key]];const labels=step.options.filter(o=>chosen.includes(o[0])).map(o=>o[1]).join(' · ');row.append(create('dt','',step.label),create('dd','',labels),edit);summary.append(row);});content.append(summary,create('p','hxf-review-note','Your base: sea moss gel. Your next page connects this profile with the herbal powder ingredients being considered.'));
      }else{
        const step=steps[index],fieldset=create('fieldset',`hxf-choices${step.visual?' hxf-choices--visual':''}`);fieldset.append(create('legend','',step.title));
        step.options.forEach(([value,label,description])=>{
          const choice=create('label','hxf-choice'),input=create('input');input.type=step.multi?'checkbox':'radio';input.name=`hx-hair-${step.key}`;input.value=value;input.checked=step.multi?(answers[step.key]||[]).includes(value):answers[step.key]===value;
          input.addEventListener('change',()=>{if(step.multi){let selected=[...(answers[step.key]||[])];if(input.checked){selected=value==='nothing'?['nothing']:[...selected.filter(v=>v!=='nothing'&&v!==value),value];}else selected=selected.filter(v=>v!==value);answers[step.key]=selected;fieldset.querySelectorAll('input').forEach(el=>{el.checked=selected.includes(el.value);});}else answers[step.key]=value;error.hidden=true;next.disabled=!valid(step,answers[step.key]);});
          const copy=create('span','hxf-choice-copy');copy.append(create('strong','',label));if(description)copy.append(create('small','',description));const image=step.visual?photo('area',value):(step.key==='concerns'?photo('concerns',value):null);if(image)choice.append(image);if(step.visual&&value==='unsure')choice.classList.add('hxq-choice--unsure');choice.append(copy,input);fieldset.append(choice);
        });content.append(fieldset);
      }
      back.disabled=index===0;next.disabled=!review&&!valid(steps[index],answers[steps[index].key]);next.textContent=review?(answers.suitability==='review'?'View my next step →':'That’s me — find my blend →'):(returnToReview?'Save change →':'Continue →');if(focus)title.focus();
    }
    next.addEventListener('click',()=>{
      if(index<steps.length){if(!valid(steps[index],answers[steps[index].key])){error.textContent=steps[index].multi?'Choose at least one option to continue.':'Choose one option to continue.';error.hidden=false;content.querySelector('input')?.focus();return;}index=returnToReview?steps.length:index+1;returnToReview=false;render();return;}
      const incomplete=steps.findIndex(step=>!valid(step,answers[step.key]));if(incomplete>=0){index=incomplete;render();return;}
      const profile={version:2,goal:'hair-care',base:'sea-moss-gel',concerns:[...answers.concerns],area:answers.area,onset:answers.onset,frequency:answers.frequency,tried:[...answers.tried],desiredOutcome:answers.desiredOutcome,priority:answers.priority,reviewRequired:answers.suitability==='review',completedAt:new Date().toISOString()};
      try{const encoded=JSON.stringify(profile);sessionStorage.setItem(KEY,encoded);if(sessionStorage.getItem(KEY)!==encoded)throw new Error('Save failed');}catch(_){storageNotice.hidden=false;error.textContent='Your profile could not be saved for this tab. Retry, or explore the ingredient collection using the link below.';error.hidden=false;return;}
      const destination=new URL(root.dataset.resultUrl||'/pages/find-my-blend',window.location.href);if(preview)destination.searchParams.set('preview','1');window.location.assign(destination.href);
    });
    back.addEventListener('click',()=>{if(index>0){index-=1;returnToReview=false;render();}});
    root.querySelector('[data-clear-profile]')?.addEventListener('click',()=>{try{sessionStorage.removeItem(KEY);}catch(_){}Object.keys(answers).forEach(key=>delete answers[key]);index=0;returnToReview=false;render();});
    root.querySelector('[data-quiz-app]').hidden=false;render(false);
  }
  const initialize=scope=>scope.querySelectorAll('[data-hx-blend-quiz]').forEach(init);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>initialize(document));else initialize(document);document.addEventListener('shopify:section:load',event=>initialize(event.target));
})();
