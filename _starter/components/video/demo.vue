<template>
  <div>
    <h1>Video</h1>
    <p>Play a video from a URL or embed a video iframe player from YouTube or Vimeo.</p>

    <ImportPath path="import MediaVideo from 'Components/video/MediaVideo.vue';" />

    <CodeExample
      :code="code.file"
      title="Video File"
      description="Play a video from a URL using the native browser video player."
    >
      <MediaVideo src="https://starter.wbrowar.com/video/clip.mp4" />
    </CodeExample>

    <CodeExample :code="code.youtube" title="YouTube Embedded Video" description="Embed a YouTube player.">
      <MediaVideo source="youtube" video-id="G4Sn91t1V4g" />
    </CodeExample>

    <CodeExample :code="code.vimeo" title="Vimeo Embedded Video" description="Embed a Vimeo player.">
      <MediaVideo source="vimeo" video-id="356935968" />
    </CodeExample>

    <CodeExample
      :code="code.background"
      title="Background Video"
      description="Autoplay a video as a background to its containing box."
    >
      <Box demo>
        <MediaVideo background src="https://starter.wbrowar.com/video/clip.mp4" />
      </Box>
    </CodeExample>

    <PropsTable :props="props" />
  </div>
</template>

<script>
import Box from 'Components/box/Box.vue';
import MediaVideo from 'Components/video/MediaVideo.vue';
import CodeExample from 'Starter/docs/vue/CodeExample.vue';
import CssModifiers from 'Starter/docs/vue/CssModifiers.vue';
import ImportPath from 'Starter/docs/vue/ImportPath.vue';
import PropsTable from 'Starter/docs/vue/PropsTable.vue';

export default {
  components: {
    Box,
    MediaVideo,
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
      file: `<MediaVideo src="https://starter.wbrowar.com/video/clip.mp4" />`,
      youtube: `<MediaVideo source="youtube" video-id="G4Sn91t1V4g" />`,
      vimeo: `<MediaVideo source="vimeo" video-id="356935968" />`,
      background: `<Box demo>
  <MediaVideo background src="https://starter.wbrowar.com/video/clip.mp4" />
</Box>`,
    };
    this.modifiers = [{ name: 'test', description: `Test` }];
    this.props = [
      { name: 'autoplay', type: 'Boolean', default: `false`, description: `Used to autoplay a background video.` },
      {
        name: 'background',
        type: 'Boolean',
        default: `false`,
        description: `Adds props and styles to create an auto-playing video file that resizes to 100% width and height of its container element.`,
      },
      { name: 'box', type: 'Object', description: `Props to pass into the containing Box component.` },
      { name: 'controls', type: 'Boolean', default: `true`, description: `Enable controls for file videos.` },
      {
        name: 'elementType',
        type: 'String',
        default: `'div'`,
        description: `Change the element of the container wrapper for semantic HTML or accessibility.`,
      },
      {
        name: 'loading',
        type: 'String',
        default: `'lazy'`,
        description: `Lazy loads file src or iframe src when the component enters the viewport. Accepts: 'lazy', 'auto', or 'eager'`,
      },
      { name: 'loop', type: 'Boolean', default: `false`, description: `Loops a file video.` },
      { name: 'muted', type: 'Boolean', default: `false`, description: `Mutes a file video.` },
      { name: 'playsinline', type: 'Boolean', default: `false`, description: `Lets a background video auto play.` },
      { name: 'poster', type: 'String', description: `Add a URL to a poster image for file videos.` },
      {
        name: 'source',
        type: 'String',
        default: `'file'`,
        description: `Determine if the source of a video is a file or iframe embed. Accepts: 'file', 'youtube', or 'vimeo'`,
      },
      { name: 'src', type: 'String', description: `The URL of a file video.` },
      { name: 'videoId', type: 'String', description: `The ID of a YouTube or Vimeo video.` },
    ];
  },
};
</script>
