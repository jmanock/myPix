'use strict';

window.friendlyPix = window.friendlyPix || {};

friendlyPix.MaterialUtils = class {
  static refreshSwitchState(element){
    if(element instanceof jQuery){
      element = element[0];
    }
    if(element.MaterialSwitch){
      element.MaterialSwitch.checkDisabled();
      element.MaterialSwitch.checkToggleState();
    }
  }

  static closeDrawer(){
    const drawerObfuscator = $('.mdl-layout__obfuscator');
    if(drawerObfuscator.hasClass('is-visible')){
      drawerObfuscator.click();
    }
  }

  static clearTextField(element){
    element.value = '';
    element.parentElement.MaterialTextfield.boundUpdateClassesHandler();
  }

  static cloneElementWithTextField(element){
    componentHandler.downgradeElements($('.mdl-text', element).get());
    const clone = element.clone();
    componentHandler.upgradeElements($('.mdl-textfield', element).get());
    componentHandler.upgradeElements($('.mdl-textfield', clone).get());
    return clone;
  }

  static onEndScroll(offset = 0){
    const resolver = new $.Deferred();
    const mdlLayoutElement = $('.mdl-layout');
    mdlLayoutElement.scroll(() =>{
      if((window.innerHeight + mdlLayoutElement.scrollTop() + offset) >= mdlLayoutElement.prop('scrollHeight')){
        console.log('Scroll End Reached!');
        mdlLayoutElement.unbind('scroll');
        resolver.resolve();
      }
    });
    console.log('Now watching for Scroll End.');
    return resolver.promise();
  }

  static stopOnEndScrolls(){
    const mdlLayoutElement = $('.mdl-layout');
    mdlLayoutElement.unbind('scroll');
  }
};
