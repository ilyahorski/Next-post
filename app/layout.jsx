import '~/styles/globals.css';
import Nav from '~/components/Nav';
import Provider from "~/app/provider";
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: {
    default: 'Next-post',
    template: 'Next Post',
  },
  description: 'Next platform for sharing your posts',
  applicationName: 'Next Post',

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: 'Next-post',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: 'Next Post',
    title: {
      default: 'Next-post',
      template: 'Next Post',
    },
    description: 'Next platform for sharing your posts',
  },
  twitter: {
    card: "summary",
    title: {
      default: 'Next-post',
      template: 'Next Post',
    },
    description: 'Next platform for sharing your posts',
  },
};

export const viewport = {
  themeColor: "#000000",
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
