# experiments/cnn/model.py

import torch.nn as nn

class FTIRCNN(nn.Module):
    def __init__(self, input_size, num_classes):
        super().__init__()

        self.conv1 = nn.Conv1d(1, 16, kernel_size=5, padding=2)
        self.conv2 = nn.Conv1d(16, 32, kernel_size=5, padding=2)
        self.conv3 = nn.Conv1d(32, 64, kernel_size=3, padding=1)

        self.pool = nn.MaxPool1d(2)
        self.relu = nn.ReLU()

        self.flatten = nn.Flatten()

        self.fc1 = nn.Linear((input_size // 8) * 64, 128)
        self.fc2 = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = self.pool(self.relu(self.conv3(x)))

        x = self.flatten(x)
        x = self.relu(self.fc1(x))
        return self.fc2(x)