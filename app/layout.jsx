import '~/styles/globals.css';
import Nav from '~/components/Nav';
import Provider from "~/app/provider";

export const metadata = {
  title: 'Next-post',
  description: 'Next platform for sharing your posts',
};

const RootLayout = ({ children }) => {

  return (
    <html lang='en'>
    <body>
      <div className='main main_gradient'>
      </div>
      <main className='app'>
        <Provider>
          <Nav />
          {children}
        </Provider>
      </main>
    </body>
    </html>
  );
};

export default RootLayout;
