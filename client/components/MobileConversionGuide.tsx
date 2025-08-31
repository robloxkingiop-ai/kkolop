import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Smartphone,
  Download,
  Code,
  Settings,
  CloudUpload,
  Wifi,
  WifiOff,
  RefreshCw,
  FileCode2,
  Package,
  Globe,
  Terminal,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FRAMEWORKS = [
  {
    name: "React Native",
    icon: "⚛️",
    difficulty: "Medium",
    timeEstimate: "2-4 weeks",
    description: "Recommended for this app since it's already React-based",
    pros: ["Code reuse", "Fast development", "Large community"],
    cons: ["Platform-specific features need native code"],
    color: "bg-blue-500"
  },
  {
    name: "Flutter",
    icon: "🎯",
    difficulty: "Medium-Hard",
    timeEstimate: "3-6 weeks",
    description: "Google's cross-platform framework with excellent performance",
    pros: ["Single codebase", "Great performance", "Rich UI"],
    cons: ["Dart language learning curve", "Full rewrite needed"],
    color: "bg-cyan-500"
  },
  {
    name: "Xamarin",
    icon: "🔷",
    difficulty: "Hard",
    timeEstimate: "4-8 weeks",
    description: "Microsoft's solution for cross-platform development",
    pros: ["Native performance", "C# language", "Microsoft ecosystem"],
    cons: ["Complex setup", "Large app size", "Full rewrite needed"],
    color: "bg-purple-500"
  }
];

const CONVERSION_STEPS = [
  {
    title: "Environment Setup",
    icon: <Settings className="h-5 w-5" />,
    items: [
      "Install Node.js 18+ and npm/yarn",
      "Install React Native CLI: npm install -g @react-native-community/cli",
      "Install Android Studio with SDK 31+",
      "Install Xcode (for iOS) if on macOS",
      "Set up Android emulator or physical device"
    ]
  },
  {
    title: "Project Initialization",
    icon: <Package className="h-5 w-5" />,
    items: [
      "Create new React Native project: npx react-native init BBStaffApp",
      "Install navigation: npm install @react-navigation/native @react-navigation/stack",
      "Install UI library: npm install react-native-elements react-native-vector-icons",
      "Install offline storage: npm install @react-native-async-storage/async-storage",
      "Install network detection: npm install @react-native-community/netinfo"
    ]
  },
  {
    title: "Code Migration",
    icon: <Code className="h-5 w-5" />,
    items: [
      "Convert React components to React Native components",
      "Replace HTML elements with React Native equivalents",
      "Implement native navigation instead of React Router",
      "Adapt Tailwind styles to React Native StyleSheet",
      "Handle platform-specific differences (iOS/Android)"
    ]
  },
  {
    title: "Offline Functionality",
    icon: <WifiOff className="h-5 w-5" />,
    items: [
      "Implement local SQLite database with react-native-sqlite-storage",
      "Create data synchronization service",
      "Add offline-first approach with Redux Persist",
      "Handle image caching for offline viewing",
      "Implement conflict resolution for data sync"
    ]
  },
  {
    title: "Build & Deploy",
    icon: <CloudUpload className="h-5 w-5" />,
    items: [
      "Configure app signing for Android/iOS",
      "Build production APK/AAB files",
      "Set up Google Play Console account",
      "Submit to Play Store for review",
      "Implement over-the-air updates with CodePush"
    ]
  }
];

const CODE_EXAMPLES = {
  setup: `// Package.json dependencies for React Native conversion
{
  "dependencies": {
    "react-native": "^0.72.0",
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/stack": "^6.3.17",
    "react-native-elements": "^3.4.3",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "@react-native-community/netinfo": "^9.4.1",
    "react-native-sqlite-storage": "^6.0.1",
    "redux": "^4.2.1",
    "redux-persist": "^6.0.0",
    "react-redux": "^8.1.1"
  }
}`,
  
  component: `// Example: Converting a web component to React Native
// Before (Web)
import { Card } from "@/components/ui/card";

function JobCard({ job }) {
  return (
    <Card className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="text-gray-600">{job.description}</p>
    </Card>
  );
}

// After (React Native)
import { View, Text, StyleSheet } from 'react-native';

function JobCard({ job }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.description}>{job.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: 'white',
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
});`,

  offline: `// Offline data management implementation
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import SQLite from 'react-native-sqlite-storage';

class OfflineManager {
  constructor() {
    this.db = null;
    this.isOnline = true;
    this.syncQueue = [];
    
    this.initDatabase();
    this.setupNetworkListener();
  }

  async initDatabase() {
    this.db = await SQLite.openDatabase(
      { name: 'BBStaffApp.db', location: 'default' }
    );
    
    // Create tables for offline storage
    await this.db.executeSql(\`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY,
        title TEXT,
        description TEXT,
        status TEXT,
        created_at DATETIME,
        synced INTEGER DEFAULT 0
      )
    \`);
    
    await this.db.executeSql(\`
      CREATE TABLE IF NOT EXISTS forms (
        id INTEGER PRIMARY KEY,
        job_id INTEGER,
        data TEXT,
        created_at DATETIME,
        synced INTEGER DEFAULT 0
      )
    \`);
  }

  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected;
      
      // When coming back online, sync pending data
      if (wasOffline && this.isOnline) {
        this.syncPendingData();
      }
    });
  }

  async saveJobOffline(job) {
    const values = [job.title, job.description, job.status, new Date().toISOString(), 0];
    await this.db.executeSql(
      'INSERT INTO jobs (title, description, status, created_at, synced) VALUES (?, ?, ?, ?, ?)',
      values
    );
    
    // Add to sync queue if online
    if (this.isOnline) {
      this.syncQueue.push({ type: 'job', data: job });
      this.processSync();
    }
  }

  async getOfflineJobs() {
    const [results] = await this.db.executeSql('SELECT * FROM jobs ORDER BY created_at DESC');
    return Array.from({ length: results.rows.length }, (_, i) => results.rows.item(i));
  }

  async syncPendingData() {
    const unsyncedJobs = await this.db.executeSql(
      'SELECT * FROM jobs WHERE synced = 0'
    );
    
    for (let i = 0; i < unsyncedJobs[0].rows.length; i++) {
      const job = unsyncedJobs[0].rows.item(i);
      try {
        // Send to server
        const response = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(job)
        });
        
        if (response.ok) {
          // Mark as synced
          await this.db.executeSql(
            'UPDATE jobs SET synced = 1 WHERE id = ?',
            [job.id]
          );
        }
      } catch (error) {
        console.log('Sync failed for job:', job.id, error);
      }
    }
  }
}`,

  navigation: `// Navigation structure for mobile app
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Forms" 
        component={FormsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="JobDetails" 
          component={JobDetailsScreen}
          options={{ title: 'Job Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`
};

export function MobileConversionGuide() {
  const { toast } = useToast();
  const [selectedFramework, setSelectedFramework] = useState(FRAMEWORKS[0]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code example has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Smartphone className="h-6 w-6 text-blue-600" />
            Mobile App Conversion Guide
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete instructions for converting this web application into a mobile app for staff usage, 
            including offline functionality and data synchronization.
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="offline">Offline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Start Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Fastest: Progressive Web App (PWA)</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Convert existing app to PWA in 1-2 days. Works offline, installable, but limited native features.
                  </p>
                  <Badge className="bg-green-100 text-green-800">⚡ 1-2 days</Badge>
                </div>
                
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Recommended: React Native</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Reuse 60-70% of existing React code. Native performance with familiar technology.
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">⚡ 2-4 weeks</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Key Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Offline-first data storage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Background sync when online
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Authentication & role management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Form submission & PDF generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Photo capture & upload
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Real-time job updates
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-500" />
                Architecture Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <Smartphone className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Mobile App</h4>
                  <p className="text-sm text-gray-600">React Native app with offline storage and background sync</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <RefreshCw className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Sync Service</h4>
                  <p className="text-sm text-gray-600">Handles data synchronization between mobile and server</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <CloudUpload className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Existing API</h4>
                  <p className="text-sm text-gray-600">Current Express server with minimal modifications needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Frameworks Tab */}
        <TabsContent value="frameworks" className="space-y-6">
          <div className="grid gap-6">
            {FRAMEWORKS.map((framework) => (
              <Card 
                key={framework.name}
                className={`cursor-pointer transition-all border-2 ${
                  selectedFramework.name === framework.name 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedFramework(framework)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{framework.icon}</span>
                      <span>{framework.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={framework.color}>{framework.difficulty}</Badge>
                      <Badge variant="outline">{framework.timeEstimate}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{framework.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-green-700 mb-2">Pros:</h5>
                      <ul className="text-sm space-y-1">
                        {framework.pros.map((pro, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-700 mb-2">Cons:</h5>
                      <ul className="text-sm space-y-1">
                        {framework.cons.map((con, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Steps Tab */}
        <TabsContent value="steps" className="space-y-6">
          <div className="space-y-6">
            {CONVERSION_STEPS.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    {step.icon}
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="space-y-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Dependencies & Setup
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(CODE_EXAMPLES.setup)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{CODE_EXAMPLES.setup}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileCode2 className="h-5 w-5" />
                    Component Conversion
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(CODE_EXAMPLES.component)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{CODE_EXAMPLES.component}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Navigation Setup
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(CODE_EXAMPLES.navigation)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{CODE_EXAMPLES.navigation}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Offline Tab */}
        <TabsContent value="offline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WifiOff className="h-5 w-5 text-red-500" />
                Offline-First Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                The mobile app will work completely offline and sync data when connection is restored. 
                Here's how data flows in different connectivity states:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Online Mode
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Real-time sync with server</li>
                      <li>• Immediate data updates</li>
                      <li>• Photo uploads in background</li>
                      <li>• Live job status changes</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <WifiOff className="h-4 w-4" />
                      Offline Mode
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• All data stored locally</li>
                      <li>• Forms saved with timestamps</li>
                      <li>• Photos cached locally</li>
                      <li>• Changes queued for sync</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Sync Strategy
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Automatic sync when online</li>
                      <li>• Conflict resolution rules</li>
                      <li>• Retry failed uploads</li>
                      <li>• Progress indicators</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Data Retention
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• 30 days of job history</li>
                      <li>• Unlimited form drafts</li>
                      <li>• Photos compressed for storage</li>
                      <li>• Auto-cleanup old data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Offline Implementation
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(CODE_EXAMPLES.offline)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                <code>{CODE_EXAMPLES.offline}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Implementation Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Considerations</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Test offline functionality thoroughly on real devices</li>
                    <li>• Implement proper error handling for sync failures</li>
                    <li>• Consider data size limits on mobile devices</li>
                    <li>• Handle timezone differences for timestamps</li>
                    <li>• Implement proper user feedback for sync status</li>
                  </ul>
                </div>
                
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📱 Testing Strategy</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Test with airplane mode on/off</li>
                    <li>• Simulate poor network conditions</li>
                    <li>• Test app restart during sync</li>
                    <li>• Verify data integrity after sync</li>
                    <li>• Test with multiple staff members syncing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Starter Template
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              React Native Documentation
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileCode2 className="h-4 w-4" />
              View Example Repository
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MobileConversionGuide;
