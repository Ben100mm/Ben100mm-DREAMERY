import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Box,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Rating
} from '@mui/material';
import { 
  School as SchoolIcon,
  Book as BookIcon,
  VideoLibrary as VideoIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  PlayCircle as PlayIcon,
  Article as ArticleIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const CourseCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProgressCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockCourses = [
  {
    id: 1,
    title: "Real Estate Investment Fundamentals",
    instructor: "Dr. Sarah Johnson",
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.8,
    students: 1250,
    price: "$299",
    category: "Investment",
    description: "Learn the basics of real estate investment, market analysis, and portfolio building.",
    topics: ["Market Analysis", "Property Valuation", "Risk Assessment", "Portfolio Strategy"],
    progress: 0
  },
  {
    id: 2,
    title: "Advanced Property Management",
    instructor: "Mike Davis",
    duration: "6 weeks",
    level: "Intermediate",
    rating: 4.6,
    students: 890,
    price: "$199",
    category: "Management",
    description: "Master property management techniques, tenant relations, and operational efficiency.",
    topics: ["Tenant Management", "Maintenance Planning", "Financial Reporting", "Legal Compliance"],
    progress: 35
  },
  {
    id: 3,
    title: "Commercial Real Estate Development",
    instructor: "Lisa Wilson",
    duration: "10 weeks",
    level: "Advanced",
    rating: 4.9,
    students: 650,
    price: "$499",
    category: "Development",
    description: "Comprehensive guide to commercial real estate development and project management.",
    topics: ["Site Selection", "Feasibility Analysis", "Project Planning", "Construction Management"],
    progress: 0
  },
  {
    id: 4,
    title: "Real Estate Law & Regulations",
    instructor: "Attorney Robert Chen",
    duration: "4 weeks",
    level: "Intermediate",
    rating: 4.7,
    students: 1100,
    price: "$149",
    category: "Legal",
    description: "Essential legal knowledge for real estate professionals and investors.",
    topics: ["Contract Law", "Zoning Regulations", "Tax Implications", "Dispute Resolution"],
    progress: 0
  }
];

const mockArticles = [
  {
    id: 1,
    title: "Market Trends: Q4 2024 Real Estate Outlook",
    author: "Market Analysis Team",
    date: "2024-01-15",
    readTime: "5 min",
    category: "Market Analysis",
    featured: true
  },
  {
    id: 2,
    title: "Tax Strategies for Real Estate Investors",
    author: "Tax Advisory Group",
    date: "2024-01-12",
    readTime: "8 min",
    category: "Tax & Finance",
    featured: false
  },
  {
    id: 3,
    title: "Sustainable Development in Modern Real Estate",
    author: "Green Building Initiative",
    date: "2024-01-10",
    readTime: "6 min",
    category: "Sustainability",
    featured: true
  }
];

const mockLearningMetrics = {
  coursesCompleted: 3,
  totalHours: 24,
  certificates: 2,
  currentStreak: 7,
  averageScore: "87%"
};

const LearnPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  return (
    <PageTemplate 
      title="Learning Center" 
      subtitle="Expand your real estate knowledge with expert-led courses and resources"
      showAuthContent={true}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Courses" />
          <Tab label="My Learning" />
          <Tab label="Resources" />
          <Tab label="Certifications" />
        </Tabs>
      </Box>

      {/* Courses Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Courses
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Choose from our comprehensive library of real estate courses and training programs.
          </Typography>

          <Grid container spacing={3}>
            {mockCourses.map((course) => (
              <Grid item xs={12} md={6} lg={3} key={course.id}>
                <CourseCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {course.instructor}
                        </Typography>
                      </Box>
                      <Chip 
                        label={course.level} 
                        color={
                          course.level === 'Beginner' ? 'success' : 
                          course.level === 'Intermediate' ? 'warning' : 
                          'error'
                        }
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" paragraph>
                      {course.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={course.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({course.rating})
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {course.students} students
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Duration:</strong> {course.duration}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Category:</strong> {course.category}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Price:</strong> {course.price}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Topics Covered:</strong>
                      </Typography>
                      {course.topics.map((topic, index) => (
                        <Chip 
                          key={index}
                          label={topic} 
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>

                    <Button variant="contained" fullWidth>
                      Enroll Now
                    </Button>
                  </CardContent>
                </CourseCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* My Learning Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Learning Progress
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Track your course progress and continue your learning journey.
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Last Accessed</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockCourses.filter(c => c.progress > 0).map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {course.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              by {course.instructor}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={course.progress} 
                                sx={{ width: 100, mr: 1 }}
                              />
                              <Typography variant="body2">
                                {course.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              2 days ago
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={course.progress === 100 ? "Completed" : "In Progress"} 
                              color={course.progress === 100 ? "success" : "primary"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button size="small" variant="outlined">
                              Continue
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <ProgressCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Learning Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Courses Completed:</strong> {mockLearningMetrics.coursesCompleted}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Hours:</strong> {mockLearningMetrics.totalHours}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Certificates:</strong> {mockLearningMetrics.certificates}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Current Streak:</strong> {mockLearningMetrics.currentStreak} days
                  </Typography>
                  <Typography variant="body2">
                    <strong>Average Score:</strong> {mockLearningMetrics.averageScore}
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  View Certificates
                </Button>
              </CardContent>
            </ProgressCard>
          </Grid>
        </Grid>
      )}

      {/* Resources Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Learning Resources
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Access articles, videos, and tools to enhance your real estate knowledge.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Featured Articles
                  </Typography>
                  <List>
                    {mockArticles.map((article) => (
                      <ListItem key={article.id}>
                        <ListItemIcon>
                          <ArticleIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={article.title}
                          secondary={`${article.author} • ${article.date} • ${article.readTime} read`}
                        />
                        {article.featured && (
                          <Chip label="Featured" color="primary" size="small" />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resource Categories
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><BookIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Market Analysis" 
                        secondary="15 articles"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><VideoIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Video Tutorials" 
                        secondary="8 series"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><AssignmentIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Case Studies" 
                        secondary="12 examples"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><TrendingIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Industry Reports" 
                        secondary="6 reports"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><AssessmentIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Tools & Calculators" 
                        secondary="10 tools"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Certifications Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available Certifications
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Earn industry-recognized certifications to advance your career.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Certified Real Estate Investor (CREI)
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Comprehensive certification covering investment strategies, market analysis, and portfolio management.
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Duration:</strong> 6 months
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Prerequisites:</strong> None
                          </Typography>
                          <Typography variant="body2">
                            <strong>Exam:</strong> 200 questions
                          </Typography>
                        </Box>
                        <Button variant="contained" fullWidth>
                          Start Certification
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Property Management Professional (PMP)
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Advanced certification for property managers covering operations, legal compliance, and tenant relations.
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Duration:</strong> 4 months
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Prerequisites:</strong> 2 years experience
                          </Typography>
                          <Typography variant="body2">
                            <strong>Exam:</strong> 150 questions
                          </Typography>
                        </Box>
                        <Button variant="contained" fullWidth>
                          Start Certification
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Certifications
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Real Estate Fundamentals" 
                      secondary="Completed Jan 2024"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Property Management Basics" 
                      secondary="Completed Dec 2023"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                    <ListItemText 
                      primary="Advanced Investment Strategies" 
                      secondary="In Progress - 60%"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Placeholder Learning Cards */}
        <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 700, mb: 3, mt: 4 }}>
          Featured Learning Resources
        </Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 10 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`learn-placeholder-${index}`}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)' 
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://via.placeholder.com/300x200/1a365d/ffffff?text=Course+${index + 1}`}
                  alt={`Course ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ color: '#1a365d', fontWeight: 600, mb: 1 }}>
                    Course #{index + 1}
                  </Typography>
                  
                  <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
                    ${(199 + index * 25)}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: '#718096', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {['Real Estate Basics', 'Investment Strategies', 'Property Management', 'Mortgage Fundamentals', 'Market Analysis', 'Negotiation Skills', 'Legal Aspects', 'Tax Planning', 'Marketing Properties', 'Portfolio Management'][index]}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {(8 + index)} hours
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {(4 + index)} modules
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {(85 + index)}% complete
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#1a365d',
                      '&:hover': { backgroundColor: '#0d2340' }
                    }}
                  >
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </PageTemplate>
  );
};

export default LearnPage; 