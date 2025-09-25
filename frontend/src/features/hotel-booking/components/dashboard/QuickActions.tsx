"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Building2, 
  BarChart3, 
  AlertTriangle, 
  Users, 
  Calendar 
} from 'lucide-react';

interface QuickActionsProps {
  conflictsCount: number;
  onCreateHotel?: () => void;
  onCreateRoom?: () => void;
  onViewReports?: () => void;
  onViewConflicts?: () => void;
  onViewAnalytics?: () => void;
}

export default function QuickActions({ 
  conflictsCount,
  onCreateHotel,
  onCreateRoom,
  onViewReports,
  onViewConflicts,
  onViewAnalytics
}: QuickActionsProps) {
  const actions = [
    {
      title: 'Add New Hotel',
      description: 'Create a new hotel property',
      icon: Building2,
      onClick: onCreateHotel,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Manage Rooms',
      description: 'Add or edit hotel rooms',
      icon: Users,
      onClick: onCreateRoom,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: BarChart3,
      onClick: onViewAnalytics,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Resolve Conflicts',
      description: `${conflictsCount} conflicts need attention`,
      icon: AlertTriangle,
      onClick: onViewConflicts,
      color: conflictsCount > 0 
        ? 'bg-red-500 hover:bg-red-600' 
        : 'bg-gray-400 hover:bg-gray-500',
      urgent: conflictsCount > 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all border-2"
              onClick={action.onClick}
            >
              <div className={`p-3 rounded-full ${action.color} text-white`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
              </div>
              {action.urgent && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </Button>
          ))}
        </div>
        
        {/* Additional quick stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Need help getting started?</span>
            <Button variant="ghost" size="sm">
              View Tutorial
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}