import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import Button from './Button.vue';

const factory = (props = {}) => {
  return shallowMount(Button, {
    propsData: props,
    stubs: {
      NuxtLink: RouterLinkStub,
    },
  });
};

describe('Button', () => {
  test('Shows text label.', () => {
    const wrapper = factory({
      textLabel: 'About (internal)',
    });
    expect(wrapper.html()).toContain('About (internal)');
  });

  test('Click emits `clicked` event.', () => {
    const wrapper = factory({
      textLabel: 'About (internal)',
    });
    wrapper.trigger('click');
    expect(wrapper.emitted().clicked).toBeTruthy();
  });
});
