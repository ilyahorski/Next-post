import '~/styles/globals.css';
import Nav from '~/components/Nav';
import Provider from "~/app/provider";
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Next-post',
  description: 'Next platform for sharing your posts',
};

const RootLayout = ({children}) => {

  return (
    <html lang='en'>
    <body>
      <div className='main main_gradient_light main_gradient_dark'>
      </div>
      <Provider>
        <main className='app'>
          <Nav/>
          {children}
          <Analytics />
        </main>
      </Provider>
    </body>
    </html>
  );
};

export default RootLayout;
