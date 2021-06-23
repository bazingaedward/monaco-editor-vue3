/**
 * Editor Test Case
 */
import { mount } from '@vue/test-utils'
import MonacoEditor from '../src/Editor.vue'

describe('monaco editor', ()=>{
    it('is a vue component', ()=>{
        const wrapper = mount(MonacoEditor)
        expect(wrapper).toBeTruthy()
    })
})