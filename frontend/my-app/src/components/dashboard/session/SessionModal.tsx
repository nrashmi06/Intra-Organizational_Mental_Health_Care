import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import  Badge  from '@/components/ui/badge';

const getCategoryStyles = (category) => {
    switch (category) {
      case 'STRESS':
        return 'bg-gradient-to-r from-orange-200 to-orange-300 text-orange-700 border-orange-200';
      case 'DEPRESSION':
        return 'bg-gradient-to-r from-blue-200 to-blue-300 text-blue-700 border-blue-200';
      case 'SUICIDAL':
        return 'bg-gradient-to-r from-red-200 to-red-300 text-red-700 border-red-200';
      case 'BREAKUP':
        return 'bg-gradient-to-r from-rose-200 to-rose-300 text-rose-700 border-rose-200';
      case 'ANXIETY':
        return 'bg-gradient-to-r from-amber-200 to-amber-300 text-amber-700 border-amber-200';
      case 'GRIEF':
        return 'bg-gradient-to-r from-purple-200 to-purple-300 text-purple-700 border-purple-200';
      case 'TRAUMA':
        return 'bg-gradient-to-r from-pink-200 to-pink-300 text-pink-700 border-pink-200';
      case 'RELATIONSHIP_ISSUES':
        return 'bg-gradient-to-r from-teal-200 to-teal-300 text-teal-700 border-teal-200';
      case 'SELF_ESTEEM':
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 border-green-200';
      case 'OTHER':
      default:
        return 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 border-slate-200';
    }
  };
  
  const formatCategoryName = (category) => {
    return category
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

// Enhanced Session Modal with improved styling
export const SessionModal = ({ session, onClose }) => {
  const categoryStyle = getCategoryStyles(session.sessionCategory);
  const formattedCategory = formatCategoryName(session.sessionCategory);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-xl shadow-xl border-0">
        <DialogHeader className="pb-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <Badge variant="outline" className={`px-3 py-1 text-xs font-medium rounded-full ${categoryStyle}`}>
            {formattedCategory}
          </Badge>
              <DialogTitle className="text-xl font-bold">
                Session #{session.sessionId}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="my-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">SESSION SUMMARY</h3>
          <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
            {session.sessionSummary}
          </div>
        </div>
        
        <DialogFooter className="pt-2 border-t border-gray-100">
          <Button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};