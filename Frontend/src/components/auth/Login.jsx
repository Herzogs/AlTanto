import { useState } from 'react';
import axiosInstance from '@interceptors/axiosConfig';
import { userStore } from '@store';
import ModalAT from '@components/modal/ModalAT';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [messageModal, setMessageModal] = useState('');
  const { setToken, setUser } = userStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userForm = {
      email,
      password,
    };
    try {
      const response = await axiosInstance.post('/auth/login', userForm)
      if(response.status === 200){
        console.log(response.data)
        setToken(response.data.token)
        setUser(response.data.user)
        setTitleModal('Success');
        setMessageModal(response.data.message);
      } else {
        setTitleModal('Error');
        setMessageModal(response.data.message);
      }
    }catch (error) {
      setTitleModal('Error');
      setMessageModal(error.message);
      
    }finally {
      setShowModal(true);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <ModalAT
        title={titleModal}
        message={messageModal}
        showModal={showModal}
        setShowModal={setShowModal}
        url="/"
      />

    </div>
  );
};

export default Login;
