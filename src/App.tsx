import './App.css';
import { CreatePost } from './components/CreatePost';
import { DisplayPosts } from './components/DisplayPosts';
import { withAuthenticator } from 'aws-amplify-react';

const App = () => {
  return (
    <div className="app">
      <CreatePost />
      <DisplayPosts />
    </div>
  );
}
//@ts-ignore
export default withAuthenticator(App, {includeGreetings: true});
