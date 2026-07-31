# Week 3 AI Model Evaluation Report

## Model Architecture
- **Algorithm:** Random Forest Classifier
- **Input Features:** `[hr_rolling_mean, hr_rolling_std, gsr_rolling_mean, temp_rolling_mean]`
- **Output Classes:** `0: Normal`, `1: Warning`, `2: Critical`

## Performance Metrics
```
              precision    recall  f1-score   support

  Normal (0)       0.97      1.00      0.99        36
 Warning (1)       1.00      0.88      0.93         8
Critical (2)       1.00      1.00      1.00        16

    accuracy                           0.98        60
   macro avg       0.99      0.96      0.97        60
weighted avg       0.98      0.98      0.98        60

```
