<template>
  <div>
    <h1>Audio</h1>
    <p>Play an audio file using the native browser audio player.</p>

    <ImportPath path="import MediaAudio from 'Components/audio/MediaAudio';" />

    <CodeExample
      :code="code.file"
      title="Audio File"
      description="Play an audio file using the native browser audio player."
    >
      <MediaAudio src="https://starter.wbrowar.com/audio/clip.mp3" />
    </CodeExample>

    <PropsTable :props="props" />
  </div>
</template>

<script>
import Box from 'Components/box/Box';
import MediaAudio from 'Components/audio/MediaAudio';
import CodeExample from 'Starter/style_inventory/vue/CodeExample';
import CssModifiers from 'Starter/style_inventory/vue/CssModifiers';
import ImportPath from 'Starter/style_inventory/vue/ImportPath';
import PropsTable from 'Starter/style_inventory/vue/PropsTable';

export default {
  components: {
    Box,
    MediaAudio,
    CodeExample,
    CssModifiers,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      code: false,
      modifiers: false,
      props: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.code = {
      file: `<MediaAudio src="https://starter.wbrowar.com/audio/clip.mp3" />`,
    };
    this.modifiers = [{ name: 'test', description: `Test` }];
    this.props = [
      { name: 'controls', type: 'Boolean', default: `true`, description: `Enable controls for audio player.` },
      {
        name: 'loading',
        type: 'String',
        default: `'lazy'`,
        description: `Lazy loads file src when the component enters the viewport. Accepts: 'lazy', 'auto'`,
      },
      { name: 'loop', type: 'Boolean', default: `false`, description: `Loops the audio.` },
      { name: 'src', type: 'String', description: `The URL of the audio file.` },
    ];
  },
};
</script>
