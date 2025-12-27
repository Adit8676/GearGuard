import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EyeBall = ({ eyeRef, mouseX, mouseY, isBlinking, forceLookX, forceLookY, showPassword }) => {
  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), 6);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };
  const pupil = calculatePupilPosition();
  return (
    <div ref={eyeRef} style={{ width: '20px', height: isBlinking ? '2px' : '20px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'height 0.15s', overflow: 'hidden' }}>
      {!isBlinking && <div style={{ width: '8px', height: '8px', background: '#2D2D2D', borderRadius: '50%', transform: `translate(${showPassword ? forceLookX : pupil.x}px, ${showPassword ? forceLookY : pupil.y}px)`, transition: 'transform 0.1s' }} />}
    </div>
  );
};

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isBlinking1, setIsBlinking1] = useState(false);
  const [isBlinking2, setIsBlinking2] = useState(false);
  const [isBlinking3, setIsBlinking3] = useState(false);
  const [isBlinking4, setIsBlinking4] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();
  const eye1 = useRef(null), eye2 = useRef(null), eye3 = useRef(null), eye4 = useRef(null);
  const eye5 = useRef(null), eye6 = useRef(null), eye7 = useRef(null), eye8 = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const blink = (setter) => {
      const interval = setInterval(() => {
        setter(true);
        setTimeout(() => setter(false), 150);
      }, Math.random() * 4000 + 3000);
      return interval;
    };
    const i1 = blink(setIsBlinking1), i2 = blink(setIsBlinking2), i3 = blink(setIsBlinking3), i4 = blink(setIsBlinking4);
    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); clearInterval(i4); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isRegister ? await usersAPI.register(formData) : await usersAPI.login(formData);
      if (response.data.success) {
        login(response.data.data);
        toast.success(isRegister ? 'Registration successful!' : 'Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <>
      <style>
        {`
          .btn-gearguard {
            border: 2px solid;
            box-sizing: border-box;
            background-color: #000;
            color: #fff;
            cursor: pointer;
            font-weight: 900;
            line-height: 1.5;
            text-transform: uppercase;
            border-radius: 99rem;
            overflow: hidden;
            padding: 0.8rem 3rem;
            position: relative;
          }
          .btn-gearguard span { mix-blend-mode: difference; }
          .btn-gearguard:after, .btn-gearguard:before {
            background: linear-gradient(90deg, #fff 25%, transparent 0, transparent 50%, #fff 0, #fff 75%, transparent 0);
            content: "";
            inset: 0;
            position: absolute;
            transform: translateY(var(--progress, 100%));
            transition: transform 0.2s ease;
          }
          .btn-gearguard:after {
            --progress: -100%;
            background: linear-gradient(90deg, transparent 0, transparent 25%, #fff 0, #fff 50%, transparent 0, transparent 75%, #fff 0);
            z-index: -1;
          }
          .btn-gearguard:hover:after, .btn-gearguard:hover:before { --progress: 0; }
        `}
      </style>
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div onClick={() => navigate('/')} className="btn-gearguard" style={{ fontSize: '24px', fontWeight: 'bold', zIndex: 20, cursor: 'pointer', display: 'inline-block' }}>
          <span>⚙️ GearGuard</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '400px', position: 'relative', zIndex: 20 }}>
          <div style={{ position: 'relative', width: '550px', height: '400px' }}>
            {/* Purple tall character - Back */}
            <div style={{ position: 'absolute', bottom: 0, left: '70px', width: '180px', height: formData.password ? '440px' : '400px', background: '#6C3FF5', borderRadius: '10px 10px 0 0', transition: 'all 0.7s', transform: showPassword ? 'skewX(0deg)' : formData.password ? 'skewX(-12deg) translateX(40px)' : 'skewX(0deg)', transformOrigin: 'bottom center', zIndex: 1 }}>
              <div style={{ position: 'absolute', left: showPassword ? '20px' : '45px', top: showPassword ? '35px' : '40px', display: 'flex', gap: '32px', transition: 'all 0.7s' }}>
                <EyeBall eyeRef={eye1} mouseX={mouseX} mouseY={mouseY} isBlinking={isBlinking1} forceLookX={showPassword ? 4 : undefined} forceLookY={showPassword ? 5 : undefined} showPassword={showPassword} />
                <EyeBall eyeRef={eye2} mouseX={mouseX} mouseY={mouseY} isBlinking={isBlinking1} forceLookX={showPassword ? 4 : undefined} forceLookY={showPassword ? 5 : undefined} showPassword={showPassword} />
              </div>
            </div>

            {/* Black tall character - Middle */}
            <div style={{ position: 'absolute', bottom: 0, left: '240px', width: '120px', height: '310px', background: '#2D2D2D', borderRadius: '8px 8px 0 0', transition: 'all 0.7s', transform: showPassword ? 'skewX(0deg)' : 'skewX(0deg)', transformOrigin: 'bottom center', zIndex: 2 }}>
              <div style={{ position: 'absolute', left: showPassword ? '10px' : '26px', top: showPassword ? '28px' : '32px', display: 'flex', gap: '24px', transition: 'all 0.7s' }}>
                <EyeBall eyeRef={eye3} mouseX={mouseX} mouseY={mouseY} isBlinking={isBlinking2} forceLookX={showPassword ? -4 : undefined} forceLookY={showPassword ? -4 : undefined} showPassword={showPassword} />
                <EyeBall eyeRef={eye4} mouseX={mouseX} mouseY={mouseY} isBlinking={isBlinking2} forceLookX={showPassword ? -4 : undefined} forceLookY={showPassword ? -4 : undefined} showPassword={showPassword} />
              </div>
            </div>

            {/* Orange semi-circle - Front left */}
            <div style={{ position: 'absolute', bottom: 0, left: '0px', width: '240px', height: '200px', background: '#FF9B6B', borderRadius: '120px 120px 0 0', zIndex: 3 }}>
              <div style={{ position: 'absolute', left: showPassword ? '50px' : '82px', top: showPassword ? '85px' : '90px', display: 'flex', gap: '32px', transition: 'all 0.2s' }}>
                <EyeBall eyeRef={eye5} mouseX={mouseX} mouseY={mouseY} isBlinking={isBlinking3} forceLookX={showPassword ? -5 : undefined} forceLookY={showPassword ? -4 : undefined} showPassword={showPassword} />
                <EyeBall eyeRef={eye6} mouseX={mouseX} mouseY={mouseY} isBlinking={isBlinking3} forceLookX={showPassword ? -5 : undefined} forceLookY={showPassword ? -4 : undefined} showPassword={showPassword} />
              </div>
            </div>

            {/* Yellow tall character - Front right */}
            <div style={{ position: 'absolute', bottom: 0, left: '310px', width: '140px', height: '230px', background: '#E8D754', borderRadius: '70px 70px 0 0', zIndex: 4 }}>
              <div style={{ position: 'absolute', left: showPassword ? '20px' : '52px', top: showPassword ? '35px' : '40px', display: 'flex', gap: '24px', transition: 'all 0.2s' }}>
                <EyeBall eyeRef={eye7} mouseX={mouseX} mouseY={mouseY} isBlinking={isBlinking4} forceLookX={showPassword ? -5 : undefined} forceLookY={showPassword ? -4 : undefined} showPassword={showPassword} />
                <EyeBall eyeRef={eye8} mouseX={mouseX} mouseY={mouseY} isBlinking={isBlinking4} forceLookX={showPassword ? -5 : undefined} forceLookY={showPassword ? -4 : undefined} showPassword={showPassword} />
              </div>
              <div style={{ position: 'absolute', left: showPassword ? '10px' : '40px', top: showPassword ? '88px' : '88px', width: '80px', height: '4px', background: '#2D2D2D', borderRadius: '2px', transition: 'all 0.2s' }} />
            </div>
          </div>
        </div>
        
        <div style={{ fontSize: '12px', opacity: 0.8, zIndex: 20 }}>© 2024 GearGuard. All rights reserved.</div>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)' }} />
        <div style={{ position: 'absolute', top: '25%', right: '25%', width: '256px', height: '256px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '28px' }}>{isRegister ? 'Create Account' : 'Welcome Back!'}</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Please enter your details</p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required style={{ width: '100%', padding: '12px', paddingRight: '40px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                  {showPassword ? '👁️' : '👁️🗨️'}
                </button>
              </div>
            </div>

            {isRegister && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Role</label>
                <select name="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}>
                  <option value="user">User</option>
                  <option value="technician">Technician</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }}>
              {isRegister ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', color: '#666' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
              {isRegister ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
