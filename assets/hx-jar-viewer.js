if (!customElements.get('hx-jar-viewer')) {
  customElements.define('hx-jar-viewer', class extends HTMLElement {
    connectedCallback() {
      if(this.events)return;
      this.events=new AbortController();const options={signal:this.events.signal};
      this.sources=JSON.parse(this.querySelector('[data-jar-sources]').textContent);this.revision=this.revision||0;
      this.section=this.closest('.product-seamoss');this.embedded=this.hasAttribute('data-embedded');this.photo=this.embedded?null:this.section.querySelector('[data-product-media-main]');this.trigger=this.embedded?null:this.section.querySelector('[data-jar-trigger]');
      this.trigger?.addEventListener('click',()=>this.open(),options);
      this.section.addEventListener('click',event=>{if(!this.embedded&&event.target.closest('[data-product-thumb]'))this.close();},options);
      this.section.addEventListener('hx:variant-change',event=>{this.close();this.updateAvailability(event.detail.variant);},options);
      this.addEventListener('hx:jar-error',()=>this.showError(),options);
      this.addEventListener('click',event=>{
        const button=event.target.closest('[data-jar-action]');if(!button||!this.scene)return;
        const action=button.dataset.jarAction;
        if(action==='left')this.scene.turn(30);if(action==='right')this.scene.turn(-30);
        if(action==='front')this.scene.face(0);if(action==='label')this.scene.face(-135);if(action==='directions')this.scene.face(-235);
        if(action==='in')this.scene.zoom(.15);if(action==='out')this.scene.zoom(-.15);if(action==='reset')this.scene.reset();
      },options);
      const variants=JSON.parse(this.section.querySelector('[data-product-variants]').textContent);
      const id=this.section.querySelector('[data-product-variant-input]').value;
      this.updateAvailability(variants.find(v=>String(v.id)===id));
    }
    updateAvailability(variant){
      const flavor=(variant?.option1||'').toLowerCase();
      if(this.flavor!==flavor){this.revision++;this.scene?.dispose();this.scene=null;this.loading=false;this.flavor=flavor;this.querySelector('.hx-jar-angle').textContent='0°';}
      this.available=Boolean(this.sources[flavor]);
      if(this.trigger)this.trigger.hidden=!this.available;
      this.trigger?.setAttribute('aria-label',`Explore ${variant?.option1||''} in 360 degrees`);
      this.querySelector('.hx-jar-canvas').setAttribute('aria-label',`${variant?.option1||''} jar. Drag horizontally or use arrow keys to rotate. Plus and minus zoom.`);
      const name=variant?.option1||'';this.section.dataset.activeFlavor=name.toLowerCase();
      const nameEl=this.section.querySelector('[data-gallery-flavor]');if(nameEl)nameEl.textContent=name;
      if(this.embedded){this.hidden=!this.available;if(this.available)this.open(false);}
    }
    async open(focus=true){
      if(!this.available)return;
      this.hidden=false;if(this.photo)this.photo.hidden=true;if(!this.embedded)this.section.classList.add('is-jar-open');
      this.trigger?.classList.add('is-active');this.trigger?.setAttribute('aria-pressed','true');
      if(!this.embedded)this.section.querySelectorAll('[data-product-thumb]').forEach(b=>b.classList.remove('is-active'));
      if(this.scene){this.scene.setActive(true);if(focus)this.querySelector('.hx-jar-canvas').focus({preventScroll:true});return;}
      if(this.loading)return;
      this.loading=true;const revision=this.revision,sources=this.sources[this.flavor];const status=this.querySelector('.hx-jar-status');status.hidden=false;status.textContent='Getting your jar ready…';
      try{
        const [THREE,{createJarScene}]=await Promise.all([import(this.dataset.library),import(this.dataset.scene)]);
        if(!this.isConnected||revision!==this.revision)return;
        const scene=await createJarScene(THREE,this.querySelector('.hx-jar-canvas'),sources,degrees=>{if(revision===this.revision)this.querySelector('.hx-jar-angle').textContent=degrees+'°';});
        if(!this.isConnected||revision!==this.revision){scene.dispose();return;}
        this.scene=scene;scene.setActive(!this.hidden);status.hidden=true;
        if(!this.hidden&&focus)this.querySelector('.hx-jar-canvas').focus({preventScroll:true});
      }catch(error){if(revision===this.revision){console.warn('Jar viewer unavailable',error);this.showError();}}
      finally{if(revision===this.revision)this.loading=false;}
    }
    showError(){this.scene?.dispose();this.scene=null;const status=this.querySelector('.hx-jar-status');status.hidden=false;status.textContent='The 3D view couldn’t load. Choose a photo to keep exploring.';}
    close(){this.hidden=true;if(this.photo)this.photo.hidden=false;this.scene?.setActive(false);this.section?.classList.remove('is-jar-open');this.trigger?.classList.remove('is-active');this.trigger?.setAttribute('aria-pressed','false');}
    disconnectedCallback(){this.revision++;this.events?.abort();this.events=null;this.scene?.dispose();this.scene=null;this.loading=false;}
  });
}
