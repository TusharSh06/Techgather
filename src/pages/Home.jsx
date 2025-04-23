import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      title: 'Discover Events',
      description: 'Find and join exciting tech events happening around you.',
      link: '/events'
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: 'Join Groups',
      description: 'Connect with like-minded individuals in tech communities.',
      link: '/groups'
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'Stay Updated',
      description: 'Get notifications about events and group activities.',
      link: user ? '/profile' : '/register'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-blue-950/90 to-black/95 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat animate-ken-burns"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-blue-950/30 mix-blend-multiply"></div>
        <div className="relative z-20 text-center max-w-5xl px-4">
          <div className="space-y-4 mb-8">
            <h1 className="text-8xl font-black tracking-tight">
              <span className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.3)]">Tech</span>
              <span className="text-blue-400 drop-shadow-[0_0_25px_rgba(96,165,250,0.3)]">Gather</span>
            </h1>
            <p className="text-3xl font-light text-white/90">Welcome to the Future of Tech Events</p>
          </div>
          <p className="text-xl mb-12 text-blue-200/90 max-w-3xl mx-auto">Connect with tech enthusiasts, join exciting events, and be part of a thriving community.</p>
          
          {!user && (
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-yellow-500/30"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-black/40 hover:bg-black/50 text-yellow-400 border border-yellow-500/50 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:border-yellow-400"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-black/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-blue-500/30 hover:border-yellow-400/50"
            >
              <div className="p-8">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-950/50 rounded-xl mb-4 border border-yellow-500/20">
                  <div className="text-yellow-400">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">{feature.title}</h3>
                <p className="text-blue-200/80">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-b from-transparent to-black/90 backdrop-blur-lg border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div className="p-4">
              <p className="text-5xl font-extrabold text-yellow-400">500+</p>
              <p className="mt-2 text-lg text-blue-200/80">Active Members</p>
            </div>
            <div className="p-4">
              <p className="text-5xl font-extrabold text-blue-400">100+</p>
              <p className="mt-2 text-lg text-blue-200/80">Monthly Events</p>
            </div>
            <div className="p-4">
              <p className="text-5xl font-extrabold text-yellow-400">50+</p>
              <p className="mt-2 text-lg text-blue-200/80">Tech Groups</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 