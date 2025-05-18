import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';



export default function Home() {


  return (
    <>
      <Navbar />
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <p>This is a simple example of a React component.</p>
      <p>Here you can add more content and functionality as needed.</p>
      <p>Feel free to customize this page to fit your needs.</p>
      <p>For example, you can add more components, styles, or even connect to an API.</p>
      <p>Have fun coding!</p>
      <p>Remember to check the console for any errors or warnings.</p>
      <p>If you have any questions, feel free to ask!</p>
      <p>Happy coding!</p>
      <p>Don't forget to save your work regularly.</p>
      <p>And make sure to test your code thoroughly.</p>
      <p>Good luck with your project!</p>
      <p>If you need help, there are many resources available online.</p>
      <p>You can also reach out to the community for support.</p>
      <p>There are many forums, chat rooms, and social media groups dedicated to coding.</p>
      <p>Don't hesitate to ask for help if you get stuck.</p>
      <p>And remember, coding is a journey, not a destination.</p>
      <p>Enjoy the process and keep learning!</p>
      <Footer />
    </>
  );
}