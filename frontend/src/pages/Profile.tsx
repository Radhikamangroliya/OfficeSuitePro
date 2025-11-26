import { Mail, Phone, Globe, Linkedin, Github, ExternalLink, User } from "lucide-react";

export default function Profile() {
  const profileData = {
    name: "Radhika Mangroliya",
    email: "radhikamangroliya0@gmail.com",
    contact: "3128749134",
    linkedin: "https://www.linkedin.com/in/radhika-mangroliya-87aa75214/",
    github: "https://github.com/Radhikamangroliya",
    portfolio: "https://radhika-mangroliya-ai.netlify.app/",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-10">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-800 to-gray-600 rounded-full"></div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              My Profile
            </h1>
            <p className="text-gray-600 text-lg font-medium">Manage your profile information and links</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden mb-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-gray-800" />
              </div>
              
              {/* Name */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{profileData.name}</h2>
                <p className="text-gray-300">Full Stack Developer & AI Enthusiast</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-800" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Email */}
              <a
                href={`mailto:${profileData.email}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-800 hover:bg-gray-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-base font-semibold text-gray-900">{profileData.email}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-800 transition-colors" />
              </a>

              {/* Phone */}
              <a
                href={`tel:${profileData.contact}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-800 hover:bg-gray-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Contact</p>
                  <p className="text-base font-semibold text-gray-900">{profileData.contact}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-800 transition-colors" />
              </a>
            </div>

            {/* Social Links */}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-800" />
              Social Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* LinkedIn */}
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-800 hover:bg-gray-100 transition-all group"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                  <Linkedin className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">LinkedIn</p>
                  <p className="text-xs text-gray-500 mt-1">Professional Network</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors" />
              </a>

              {/* GitHub */}
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-800 hover:bg-gray-100 transition-all group"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">GitHub</p>
                  <p className="text-xs text-gray-500 mt-1">Code Repository</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors" />
              </a>

              {/* Portfolio */}
              <a
                href={profileData.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-800 hover:bg-gray-100 transition-all group"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">Portfolio</p>
                  <p className="text-xs text-gray-500 mt-1">Personal Website</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Github className="w-8 h-8 opacity-90" />
            </div>
            <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">GitHub Repos</p>
            <p className="text-3xl font-bold">21+</p>
            <p className="text-xs text-gray-400 mt-2">Active repositories</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Linkedin className="w-8 h-8 opacity-90" />
            </div>
            <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">LinkedIn</p>
            <p className="text-3xl font-bold">Active</p>
            <p className="text-xs text-gray-400 mt-2">Professional profile</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Globe className="w-8 h-8 opacity-90" />
            </div>
            <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">Portfolio</p>
            <p className="text-3xl font-bold">Live</p>
            <p className="text-xs text-gray-400 mt-2">AI & Data Science</p>
          </div>
        </div>
      </div>
    </div>
  );
}

