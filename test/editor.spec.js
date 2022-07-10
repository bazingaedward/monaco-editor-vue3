/**
 * Editor Test Case
 */
import { mount } from '@vue/test-utils'
import MonacoEditor from '../src/MonacoEditor.vue'

// TODO: add test
describe('monaco editor', ()=>{
      
    it('is a vue component', ()=>{
        const wrapper = mount(MonacoEditor)
        expect(wrapper).toBeTruthy()
    })
})