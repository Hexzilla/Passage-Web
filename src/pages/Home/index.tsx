import { UnityProvider } from 'contexts/UnityProvider';
import Play from '../Play';

const unityConfig = {
  loaderUrl: 'Build/public.loader.js',
  dataUrl: 'Build/public.data',
  frameworkUrl: 'Build/public.framework.js',
  codeUrl: 'Build/public.wasm',
};

const Home = () => {
  return (
    <UnityProvider unityConfig={unityConfig}>
      <Play />
    </UnityProvider>
  );
};

export default Home;
