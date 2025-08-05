# AI Deepfake Detection System

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export HUGGINGFACE_REPO="your-username/deepfake-model"
export MODEL_FILENAME="production_deepfake_detector.pth"
export NEXT_PUBLIC_API_URL="http://localhost:8000"

# Run Flask server
python app.py
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend  # or wherever your Next.js app is located

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

## 📊 Model Details

### Architecture
- **Base Model**: ResNet50 (pre-trained on ImageNet)
- **Custom Head**: 3-layer classifier with batch normalization and dropout
- **Input Size**: 224×224 RGB images
- **Output**: Binary classification (Real/Fake)
- **Parameters**: 25M+ total parameters

### Training Specifications
- **Dataset**: 500K+ verified real and fake images
- **Training Split**: 80% train, 20% validation
- **Optimization**: AdamW with weight decay
- **Learning Rate**: 0.0001 with ReduceLROnPlateau scheduler
- **Batch Size**: 16 (adjustable based on GPU memory)
- **Epochs**: 30 with early stopping

### Performance Metrics
```
Accuracy:  98.5%
Precision: 98.2%
Recall:    98.7%
F1-Score:  98.4%
```


### Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid file, missing parameters)
- `413`: Payload Too Large (file > 16MB)
- `500`: Internal Server Error

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required
HUGGINGFACE_REPO=your-username/deepfake-model
MODEL_FILENAME=production_deepfake_detector.pth
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional - Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your-cloud-name
