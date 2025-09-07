import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Loader2
} from 'lucide-react';
import { useLabReports, type LabReport } from '@/hooks/useLabReports';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ReportsTable = () => {
  const { reports, loading, deleteReport } = useLabReports();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const getStatusIcon = (status: LabReport['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: LabReport['status']) => {
    const variants = {
      pending: 'secondary',
      processing: 'default', 
      completed: 'secondary',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status] || 'secondary'} className={`flex items-center gap-1 ${
        status === 'completed' ? 'bg-secondary text-secondary-foreground' : ''
      }`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleView = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const handleDownload = (report: LabReport) => {
    if (report.file_url) {
      window.open(report.file_url, '_blank');
    }
  };

  const handleDelete = async (reportId: string) => {
    try {
      setDeletingId(reportId);
      await deleteReport(reportId);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="card-medical">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your reports...</p>
        </CardContent>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="card-medical">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Your uploaded lab reports will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first lab report to get started with AI analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-medical">
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
        <CardDescription>
          View and manage your uploaded lab reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:shadow-card transition-medical"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{report.title}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {report.description || 'No description provided'}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                  </span>
                  {report.file_size && (
                    <span>
                      {(report.file_size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(report.status)}
              
              <div className="flex items-center gap-1">
                {report.status === 'completed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(report.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                
                {report.file_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(report)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      disabled={deletingId === report.id}
                    >
                      {deletingId === report.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Report</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{report.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(report.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ReportsTable;