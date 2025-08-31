import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Float, Text3D, Center } from "@react-three/drei";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import * as THREE from "three";

// Add smooth scrolling styles
const smoothScrollStyle = `
  html {
    scroll-behavior: smooth;
  }
  
  .smooth-scroll {
    scroll-behavior: smooth;
  }
`;

// Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

// Cart item interface
interface CartItem extends Product {
  quantity: number;
}

// Staff member interface
interface StaffMember {
  id: string;
  name: string;
  position: string;
  image: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    email?: string;
    phone?: string;
  };
}

// Featured categories
const FEATURED_CATEGORIES = [
  {
    id: "pipes",
    name: "Pipes & Fittings",
    image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
    description: "Complete range of pipes and connecting fittings"
  },
  {
    id: "tools", 
    name: "Professional Tools",
    image: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg",
    description: "High-quality tools for every plumbing job"
  },
  {
    id: "pumps",
    name: "Pumps & Motors", 
    image: "https://images.pexels.com/photos/159160/gear-machine-mechanical-engine-159160.jpeg",
    description: "Industrial pumps and motor systems"
  },
  {
    id: "fixtures",
    name: "Fixtures & Appliances",
    image: "https://images.pexels.com/photos/6419121/pexels-photo-6419121.jpeg", 
    description: "Bathroom and kitchen fixtures"
  }
];

// Staff data
const STAFF_MEMBERS: StaffMember[] = [
  {
    id: "vinesh",
    name: "Vinesh Patel",
    position: "Chief Executive Officer",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg",
    bio: "Leading BlockBusters with over 20 years of experience in the plumbing industry. Committed to delivering excellence and innovation in every project.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/vinesh-patel",
      email: "vinesh@bbplumbing.co.za",
      phone: "+27-11-555-0001"
    }
  },
  {
    id: "rona",
    name: "Rona Williams", 
    position: "Chief Financial Officer",
    image: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg",
    bio: "Financial strategist with expertise in operations management and business development. Ensuring sustainable growth and operational excellence.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/rona-williams",
      email: "rona@bbplumbing.co.za", 
      phone: "+27-11-555-0002"
    }
  },
  {
    id: "team1",
    name: "Marcus Johnson",
    position: "Operations Manager",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg"
  },
  {
    id: "team2", 
    name: "Sarah Mitchell",
    position: "Customer Relations",
    image: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg"
  },
  {
    id: "team3",
    name: "David Thompson", 
    position: "Technical Specialist",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg"
  },
  {
    id: "team4",
    name: "Lisa Anderson",
    position: "Quality Assurance",
    image: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg"
  }
];

// Enhanced plumbing products with featured flag
const PLUMBING_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Professional Pipe Wrench Set",
    price: 450.00,
    image: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg",
    category: "Tools",
    description: "Heavy-duty pipe wrench set for professional plumbers",
    inStock: true,
    featured: true
  },
  {
    id: "2", 
    name: "Copper Pipe Fittings Kit",
    price: 285.50,
    image: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg",
    category: "Fittings",
    description: "Complete copper pipe fitting kit with joints and connections",
    inStock: true,
    featured: true
  },
  {
    id: "3",
    name: "High-Pressure Water Pump",
    price: 1250.00,
    image: "https://images.pexels.com/photos/159160/gear-machine-mechanical-engine-159160.jpeg",
    category: "Pumps",
    description: "Industrial grade water pump for high-pressure applications",
    inStock: true,
    featured: true
  },
  {
    id: "4",
    name: "PVC Pipe Bundle - 4 inch",
    price: 185.75,
    image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
    category: "Pipes",
    description: "4-inch PVC pipes, 6-meter length bundle",
    inStock: true
  },
  {
    id: "5",
    name: "Emergency Leak Repair Kit",
    price: 95.00,
    image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
    category: "Repair",
    description: "Emergency leak repair kit with sealants and patches",
    inStock: true,
    featured: true
  },
  {
    id: "6",
    name: "Digital Water Flow Meter",
    price: 320.00,
    image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg",
    category: "Meters",
    description: "Digital water flow meter with LCD display",
    inStock: true
  },
  {
    id: "7",
    name: "Toilet Installation Kit",
    price: 145.25,
    image: "https://images.pexels.com/photos/6419121/pexels-photo-6419121.jpeg",
    category: "Installation",
    description: "Complete toilet installation kit with all hardware",
    inStock: true
  },
  {
    id: "8",
    name: "Professional Drain Snake",
    price: 275.00,
    image: "https://images.pexels.com/photos/8101965/pexels-photo-8101965.jpeg",
    category: "Tools",
    description: "50-foot professional drain snake for blockage removal",
    inStock: true
  }
];

// Ideas & Learning content
const LEARNING_CONTENT = [
  {
    id: "safety",
    title: "Safety Matters",
    description: "Learn what you can do to minimize the risk of work-related injuries.",
    image: "https://images.pexels.com/photos/5691657/pexels-photo-5691657.jpeg",
    category: "Safety"
  },
  {
    id: "trade-talk",
    title: "Trade Talk", 
    description: "Get ideas, tips and trends on the tools contractors use every day.",
    image: "https://images.pexels.com/photos/8471921/pexels-photo-8471921.jpeg",
    category: "Tips & Trends"
  },
  {
    id: "case-studies",
    title: "Case Studies",
    description: "See how we helped real-life customers overcome challenges on the job.",
    image: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg",
    category: "Success Stories"
  }
];

// Scroll-controlled 3D Model Component
function ScrollControlledModel() {
  const { scene } = useGLTF("/modern_bathroom.glb");
  const modelRef = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();
  const [manualControl, setManualControl] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const lastScrollTarget = useRef({ x: 0, y: 0, z: 0, rotation: { x: 0, y: 0, z: 0 } });

  // Define scroll-triggered positions and rotations - Circle around as if standing in middle facing right wall
  const scrollSections = [
    { position: [1, 0.5, 2], rotation: [0, Math.PI/4, 0], scale: 2.5 }, // Hero - Close up inside corner
    { position: [0, 0, 1.5], rotation: [0, Math.PI/2, 0], scale: 2 }, // Categories - Facing right wall
    { position: [-1, 0, 0.5], rotation: [0, Math.PI, 0], scale: 1.8 }, // Products - Facing back wall
    { position: [-0.5, 0, -1], rotation: [0, -Math.PI/2, 0], scale: 2.2 }, // About - Facing left wall
    { position: [0.5, 0.3, -0.8], rotation: [0.1, -Math.PI/4, 0], scale: 1.9 }, // Learning - Corner view
    { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1.5 } // Footer - Center overview
  ];

  // Set initial position on mount
  useEffect(() => {
    if (modelRef.current) {
      const initialSection = scrollSections[0]; // Hero section
      modelRef.current.position.set(initialSection.position[0], initialSection.position[1], initialSection.position[2]);
      modelRef.current.rotation.set(initialSection.rotation[0], initialSection.rotation[1], initialSection.rotation[2]);
      modelRef.current.scale.setScalar(initialSection.scale);

      lastScrollTarget.current = {
        x: initialSection.position[0],
        y: initialSection.position[1],
        z: initialSection.position[2],
        rotation: { x: initialSection.rotation[0], y: initialSection.rotation[1], z: initialSection.rotation[2] }
      };
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (manualControl) return;

      const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const sectionIndex = Math.floor(scrollProgress * (scrollSections.length - 1));
      const sectionProgress = (scrollProgress * (scrollSections.length - 1)) - sectionIndex;

      setScrollPosition(scrollProgress);

      if (modelRef.current && sectionIndex < scrollSections.length - 1) {
        const currentSection = scrollSections[sectionIndex];
        const nextSection = scrollSections[sectionIndex + 1];

        // Interpolate position
        const targetPosition = [
          THREE.MathUtils.lerp(currentSection.position[0], nextSection.position[0], sectionProgress),
          THREE.MathUtils.lerp(currentSection.position[1], nextSection.position[1], sectionProgress),
          THREE.MathUtils.lerp(currentSection.position[2], nextSection.position[2], sectionProgress)
        ];

        // Interpolate rotation
        const targetRotation = [
          THREE.MathUtils.lerp(currentSection.rotation[0], nextSection.rotation[0], sectionProgress),
          THREE.MathUtils.lerp(currentSection.rotation[1], nextSection.rotation[1], sectionProgress),
          THREE.MathUtils.lerp(currentSection.rotation[2], nextSection.rotation[2], sectionProgress)
        ];

        // Interpolate scale
        const targetScale = THREE.MathUtils.lerp(currentSection.scale, nextSection.scale, sectionProgress);

        lastScrollTarget.current = {
          x: targetPosition[0],
          y: targetPosition[1],
          z: targetPosition[2],
          rotation: { x: targetRotation[0], y: targetRotation[1], z: targetRotation[2] }
        };

        modelRef.current.position.set(targetPosition[0], targetPosition[1], targetPosition[2]);
        modelRef.current.rotation.set(targetRotation[0], targetRotation[1], targetRotation[2]);
        modelRef.current.scale.setScalar(targetScale);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [manualControl]);

  useFrame(() => {
    if (modelRef.current && !manualControl) {
      // Smooth restoration to scroll position when not manually controlling
      const target = lastScrollTarget.current;
      modelRef.current.position.lerp(new THREE.Vector3(target.x, target.y, target.z), 0.1);
      modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, target.rotation.x, 0.1);
      modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, target.rotation.y, 0.1);
      modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, target.rotation.z, 0.1);
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene.clone()} />
    </group>
  );
}

// Octagonal social link component
function OctagonalLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-16 h-16 flex items-center justify-center transition-all duration-300 hover:scale-110"
      title={label}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl transform rotate-45 group-hover:rotate-90 transition-transform duration-300" />
      <div className="relative z-10 text-white group-hover:text-slate-900 transition-colors duration-300">
        {icon}
      </div>
    </a>
  );
}

// Grid background component
function GridBackground() {
  return (
    <div className="fixed inset-0 z-0 opacity-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [manualModelControl, setManualModelControl] = useState(false);
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Add smooth scrolling styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = smoothScrollStyle;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (user) return <Navigate to="/dashboard" replace />;

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const submitCart = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email address.",
        variant: "destructive"
      });
      return;
    }

    try {
      const cartData = {
        customer: customerInfo,
        items: cart,
        total: getTotalPrice(),
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/send-cart-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'admin@bbplumbing.co.za',
          subject: 'New Cart Submission - BlockBusters Plumbing',
          cartData
        }),
      });

      if (response.ok) {
        toast({
          title: "Cart submitted!",
          description: "Your cart has been sent to our team. We'll contact you soon.",
        });
        setCart([]);
        setCustomerInfo({ name: '', email: '', phone: '', address: '' });
        setIsCartOpen(false);
      } else {
        throw new Error('Failed to submit cart');
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleProductClick = (productId: string) => {
    const product = PLUMBING_PRODUCTS.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsProductModalOpen(true);
    }
  };

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      <GridBackground />
      
      {/* Full-screen 3D Canvas Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#00d4ff" />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0099cc" />
          
          <Suspense fallback={null}>
            <Environment preset="night" />
            <ScrollControlledModel />
          </Suspense>
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            onStart={() => setManualModelControl(true)}
            onEnd={() => {
              // Restore to scroll position after 2 seconds of inactivity
              setTimeout(() => setManualModelControl(false), 2000);
            }}
          />
        </Canvas>
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">BB</span>
              </div>
              <div>
                <div className="text-white font-bold text-xl">BlockBusters and Partners</div>
                <div className="text-cyan-400 text-sm font-medium">VRT FLOW.Outsourcing</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => smoothScrollTo('home')} className="text-slate-300 hover:text-cyan-400 transition-colors">Home</button>
              <button onClick={() => smoothScrollTo('products')} className="text-slate-300 hover:text-cyan-400 transition-colors">Products</button>
              <button onClick={() => smoothScrollTo('about')} className="text-slate-300 hover:text-cyan-400 transition-colors">About</button>
              <button onClick={() => smoothScrollTo('learning')} className="text-slate-300 hover:text-cyan-400 transition-colors">Learning</button>
              <button onClick={() => smoothScrollTo('contact')} className="text-slate-300 hover:text-cyan-400 transition-colors">Contact</button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5-6M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Cart ({cart.length})</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        {/* Content Overlay */}
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-6 py-3 bg-cyan-500/20 backdrop-blur border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-medium mb-6">
              You're Shopping South Africa Plumbing Suppliers 24/7 JHB Delivery. Tcs.
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              BlockBusters and Partners
            </span>
          </h1>
          <div className="text-xl md:text-2xl text-slate-300 mb-8">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              (Pty) LTD.
            </span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-semibold mb-10 text-slate-300">
            Your plumbing, built better
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            We transform your plumbing vision into tangible solutions with professional-grade supplies 
            that keep your projects flowing smoothly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => smoothScrollTo('products')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Now
            </button>
            <button 
              onClick={() => smoothScrollTo('about')}
              className="border-2 border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-cyan-400/10"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* WhatsApp Assistant Bot */}
        <div className="absolute bottom-8 right-8 z-20">
          {/* WhatsApp Toggle Button */}
          <button
            onClick={() => setShowWhatsAppOptions(!showWhatsAppOptions)}
            className="mb-4 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.588"/>
            </svg>
            {showWhatsAppOptions && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </button>

          {/* WhatsApp Options Panel */}
          {showWhatsAppOptions && (
            <div className="bg-green-600/95 backdrop-blur rounded-2xl p-4 text-sm text-white max-w-xs transform transition-all duration-300 ease-out animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.588"/>
                    </svg>
                  </div>
                  <span className="font-medium text-xs">Need help?</span>
                </div>
                <button
                  onClick={() => setShowWhatsAppOptions(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => window.open('https://wa.me/27115550001?text=Hi,%20I%20would%20like%20to%20place%20a%20new%20order', '_blank')}
                  className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-2 text-left text-sm flex items-center gap-2"
                >
                  🛒 <span>New Order</span>
                </button>
                <button
                  onClick={() => window.open('https://wa.me/27115550001?text=Hi,%20I%20need%20service%20assistance', '_blank')}
                  className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-2 text-left text-sm flex items-center gap-2"
                >
                  🔧 <span>Service Assistance</span>
                </button>
                <button
                  onClick={() => window.open('https://wa.me/27115550001?text=Hi,%20I%20would%20like%20to%20speak%20to%20a%20staff%20member', '_blank')}
                  className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-2 text-left text-sm flex items-center gap-2"
                >
                  👥 <span>Speak to Staff Member</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <button 
            onClick={() => smoothScrollTo('featured-categories')}
            className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center hover:border-cyan-400 transition-colors"
          >
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2"></div>
          </button>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section id="featured-categories" className="relative py-20 z-20 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-3 bg-cyan-500/20 backdrop-blur border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-medium mb-6">
              FEATURED CATEGORIES
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Shop by Category
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Find exactly what you need with our organized product categories.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => smoothScrollTo('products')}
                className="group bg-slate-800/30 backdrop-blur border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all hover:transform hover:scale-105"
              >
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                </div>
                
                <div className="p-6 text-left">
                  <h3 className="text-white font-semibold text-xl mb-3">{category.name}</h3>
                  <p className="text-slate-400 text-sm">{category.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative py-20 z-20 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-3 bg-cyan-500/20 backdrop-blur border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-medium mb-6">
              PROFESSIONAL SUPPLIES
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Premium Plumbing Products
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Quality tools and supplies for professional plumbers and contractors across South Africa.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PLUMBING_PRODUCTS.map((product) => (
              <div key={product.id} className="group bg-slate-800/50 backdrop-blur border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all hover:transform hover:scale-105">
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute top-4 right-4">
                    {product.featured && (
                      <span className="bg-yellow-500 text-slate-900 px-2 py-1 rounded-full text-xs font-bold mr-2">
                        Featured
                      </span>
                    )}
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      In Stock
                    </span>
                  </div>
                  <button
                    onClick={() => handleProductClick(product.id)}
                    className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-medium">
                      View Details
                    </span>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="text-cyan-400 text-sm font-medium mb-2">{product.category}</div>
                  <h3 className="text-white font-semibold text-lg mb-3">{product.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-cyan-400">
                      R{product.price.toFixed(2)}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Items You May Like */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Items You May Like
              </span>
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {PLUMBING_PRODUCTS.filter(p => p.featured).map((product) => (
                <div key={`featured-${product.id}`} className="bg-slate-800/30 backdrop-blur border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-400/50 transition-all">
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                  <h4 className="text-white font-medium text-sm mb-2">{product.name}</h4>
                  <div className="text-cyan-400 font-bold">R{product.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About/Staff Section */}
      <section id="about" className="relative py-20 z-20 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-3 bg-cyan-500/20 backdrop-blur border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-medium mb-6">
              OUR TEAM
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Meet Our Leadership
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experienced professionals dedicated to delivering excellence in every project.
            </p>
          </div>
          
          {/* Leadership Team */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {STAFF_MEMBERS.slice(0, 2).map((member) => (
              <div key={member.id} className="bg-slate-800/30 backdrop-blur border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition-all">
                <div className="flex items-start gap-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                    <div className="text-cyan-400 font-medium mb-4">{member.position}</div>
                    <p className="text-slate-300 mb-6">{member.bio}</p>
                    
                    {/* Octagonal social links */}
                    <div className="flex gap-3">
                      {member.socialLinks?.linkedin && (
                        <OctagonalLink 
                          href={member.socialLinks.linkedin} 
                          label="LinkedIn"
                          icon={
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          }
                        />
                      )}
                      {member.socialLinks?.email && (
                        <OctagonalLink 
                          href={`mailto:${member.socialLinks.email}`} 
                          label="Email"
                          icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          }
                        />
                      )}
                      {member.socialLinks?.phone && (
                        <OctagonalLink 
                          href={`tel:${member.socialLinks.phone}`} 
                          label="Phone"
                          icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Team Members */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Our Team
              </span>
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {STAFF_MEMBERS.slice(2).map((member) => (
                <div key={member.id} className="text-center bg-slate-800/20 backdrop-blur border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/50 transition-all">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h4 className="text-white font-semibold text-lg mb-2">{member.name}</h4>
                  <div className="text-cyan-400 text-sm">{member.position}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ideas & Learning Center */}
      <section id="learning" className="relative py-20 z-20 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-3 bg-cyan-500/20 backdrop-blur border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-medium mb-6">
              LEARNING CENTER
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Ideas & Learning Center
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Professional insights, safety guidelines, and industry best practices.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {LEARNING_CONTENT.map((content) => (
              <div key={content.id} className="group bg-slate-800/30 backdrop-blur border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all hover:transform hover:scale-105">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={content.image} 
                    alt={content.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-cyan-500/80 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-medium">
                      {content.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{content.title}</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">{content.description}</p>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative bg-slate-900/80 backdrop-blur border-t border-cyan-500/20 py-16 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-lg">BB</span>
                </div>
                <div>
                  <div className="text-white font-bold text-xl">BlockBusters and Partners</div>
                  <div className="text-cyan-400 text-sm font-medium">VRT FLOW.Outsourcing</div>
                </div>
              </div>
              <p className="text-slate-300 mb-8 max-w-md">
                Your trusted partner for professional plumbing supplies across South Africa. 
                Quality products, reliable service, delivered 24/7.
              </p>
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                View Cart & Checkout
              </button>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-cyan-400">Products</h4>
              <ul className="space-y-2 text-slate-300">
                <li><button onClick={() => smoothScrollTo('products')} className="hover:text-cyan-400 transition-colors">Pipes & Fittings</button></li>
                <li><button onClick={() => smoothScrollTo('products')} className="hover:text-cyan-400 transition-colors">Tools & Equipment</button></li>
                <li><button onClick={() => smoothScrollTo('products')} className="hover:text-cyan-400 transition-colors">Pumps & Motors</button></li>
                <li><button onClick={() => smoothScrollTo('products')} className="hover:text-cyan-400 transition-colors">Repair Kits</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-cyan-400">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li><button onClick={() => smoothScrollTo('contact')} className="hover:text-cyan-400 transition-colors">Contact Us</button></li>
                <li><button onClick={() => smoothScrollTo('learning')} className="hover:text-cyan-400 transition-colors">Learning Center</button></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Technical Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cyan-500/20 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} BlockBusters and Partners (Pty) LTD. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Product Details Modal */}
      {isProductModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-slate-800 rounded-2xl border border-cyan-500/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-80 object-cover rounded-xl"
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-cyan-400 text-sm font-medium mb-2">{selectedProduct.category}</div>
                    <div className="text-4xl font-bold text-cyan-400 mb-4">R{selectedProduct.price.toFixed(2)}</div>
                    <div className="flex items-center gap-2 mb-4">
                      {selectedProduct.featured && (
                        <span className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
                          Featured
                        </span>
                      )}
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        In Stock
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-slate-300 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Product Features</h3>
                    <ul className="text-slate-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Professional grade quality
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Industry standard compliance
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        24/7 delivery in JHB area
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Technical support included
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setIsProductModalOpen(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/27115550001?text=Hi,%20I'm%20interested%20in%20${selectedProduct.name}%20-%20R${selectedProduct.price}`, '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.588"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative bg-slate-800 rounded-2xl border border-cyan-500/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">Your cart is empty</div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{item.name}</h3>
                          <div className="text-cyan-400 font-bold">R{item.price.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-slate-600 hover:bg-slate-500 text-white w-8 h-8 rounded-lg flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-slate-600 hover:bg-slate-500 text-white w-8 h-8 rounded-lg flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-cyan-500/20 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-semibold text-white">Total:</span>
                      <span className="text-2xl font-bold text-cyan-400">R{getTotalPrice().toFixed(2)}</span>
                    </div>
                    
                    {/* Customer Information Form */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                        />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                      />
                      <textarea
                        placeholder="Delivery Address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 h-20 resize-none"
                      />
                    </div>
                    
                    <button
                      onClick={submitCart}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                    >
                      Submit Cart & Get Quote
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
