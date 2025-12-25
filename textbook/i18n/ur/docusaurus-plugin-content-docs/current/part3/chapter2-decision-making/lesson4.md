---
sidebar_position: 4
sidebar_label: Motion Planning اور Pathfinding
---

# ہیومنائڈز کے لیے Motion Planning اور Pathfinding

## خلاصہ

*   **سبق 1 - Reactive Behaviors:** محرکات کے لیے فوری، ہارڈ کوڈڈ ردعمل۔
*   **سبق 2 - State-based Decision Making:** اندرونی states اور transitions پر مبنی فیصلے۔
*   **سبق 3 - Reinforcement Learning:** آزمائش اور خطا کے ذریعے بہترین پالیسیاں سیکھنا۔

ایک بار جب ہیومنائڈ روبوٹ یہ فیصلہ کر لیتا ہے کہ *کیا* کرنا ہے (مثلاً، "باورچی خانے میں جاؤ" یا "کپ اٹھاؤ")، تو اسے یہ جاننے کی ضرورت ہے کہ جسمانی دنیا میں اس فیصلے کو *کیسے* عمل میں لانا ہے۔ یہ **motion planning** اور **pathfinding** کا ڈومین ہے۔ یہ عمل درست روبوٹ کنفیگریشنز کی ایک ترتیب (path) اور وقت کے ساتھ parameterized trajectory (motion) پیدا کرتے ہیں جو رکاوٹوں سے بچتے ہوئے اور روبوٹ کی جسمانی پابندیوں کا احترام کرتے ہوئے ہدف حاصل کرتی ہے۔

### 1. Pathfinding (Global Planning)

Pathfinding، جسے اکثر global planning کہا جاتا ہے، ایک مقررہ یا معلوم ماحول میں شروعاتی مقام سے ہدف مقام تک تصادم سے پاک راستہ تلاش کرنے پر توجہ مرکوز کرتا ہے۔ آؤٹ پٹ عام طور پر waypoints کی ایک ترتیب یا geometric path ہوتا ہے۔

#### عام Pathfinding الگورتھمز:

*   **A* (A-star) الگورتھم:** ایک وسیع پیمانے پر استعمال شدہ، موثر تلاش کا الگورتھم جو گراف میں دو nodes کے درمیان مختصر ترین راستہ تلاش کرتا ہے۔ یہ موجودہ node سے ہدف تک لاگت کا اندازہ لگانے کے لیے heuristic function استعمال کرتا ہے، جو اسے Dijkstra کے الگورتھم سے زیادہ باخبر بناتا ہے۔
    *   **Heuristic Function ($h(n)$):** node $n$ سے ہدف تک لاگت کا اندازہ۔ A* کی بہتریت کی ضمانت کے لیے *admissible* (کبھی لاگت کو زیادہ نہیں آنکتا) ہونا ضروری ہے۔
    *   **Cost Function ($g(n)$):** شروعاتی node سے node $n$ تک حقیقی لاگت۔
    *   **Evaluation Function ($f(n) = g(n) + h(n)$):** A* سب سے کم $f(n)$ والے node کو expand کرتا ہے۔
*   **Dijkstra کا الگورتھم:** ایک واحد ماخذ node سے گراف میں تمام دیگر nodes تک مختصر ترین راستے تلاش کرتا ہے۔ یہ heuristic استعمال نہیں کرتا۔
*   **Rapidly-exploring Random Tree (RRT/RRT*):** Probabilistic الگورتھمز جو اعلیٰ جہتی اور پیچیدہ جگہوں کے لیے موزوں ہیں جہاں روایتی grid پر مبنی تلاش غیر موثر ہے۔ وہ random samples کو بتدریج "بڑھا" کر قابل رسائی states کا ایک tree بناتے ہیں۔ RRT* ایک توسیع ہے جو asymptotic optimality کی ضمانت دیتی ہے۔

**ماحول کی نمائندگی:**
*   **Occupancy Grids:** ماحول کو grid میں تقسیم کیا جاتا ہے، جہاں ہر cell کو مقبوضہ (رکاوٹ) یا آزاد کے طور پر نشان زد کیا جاتا ہے۔
*   **Visibility Graphs:** Nodes رکاوٹوں کے vertices ہیں، اور edges نظر آنے والے vertices کو جوڑتے ہیں، polygon رکاوٹوں کے لیے مفید۔
*   **Probabilistic Roadmaps (PRM):** روبوٹ کے configuration space میں randomly sampled collision-free configurations کو جوڑ کر roadmap (گراف) تعمیر کرتا ہے۔

### 2. Motion Planning (Local Planning اور Trajectory Generation)

ایک بار راستہ مل جانے کے بعد، motion planning اسے ایک ہموار، dynamically feasible trajectory میں تبدیل کرتی ہے جسے روبوٹ واقعی عمل میں لا سکتا ہے۔ اس میں روبوٹ کی کائنیمیٹکس (joint limits، velocity limits، acceleration limits) اور dynamics پر غور کرنا شامل ہے۔

#### اہم پہلو:

*   **Configuration Space (C-space):** ایک کثیر جہتی جگہ جہاں ہر نقطہ روبوٹ کی ایک منفرد configuration کی نمائندگی کرتا ہے (مثلاً، تمام joint angles کا vector)۔ workspace میں رکاوٹیں C-space میں "C-obstacles" سے منسلک ہوتی ہیں۔
*   **Collision Detection:** pathfinding اور motion planning دونوں کے لیے اہم۔ الگورتھمز چیک کرتے ہیں کہ آیا روبوٹ کا کوئی حصہ کسی رکاوٹ سے ٹکرا رہا ہے۔
*   **Trajectory Optimization:** راستے کو ہموار بنانا اور timing کی معلومات شامل کرنا تاکہ روبوٹ محفوظ اور مؤثر طریقے سے حرکت کرے۔ اس میں وقت، توانائی، jerk، یا دیگر cost functions کو کم سے کم کرنا شامل ہو سکتا ہے۔
*   **Local Planners (Reactive Planning):** dynamic یا نامعلوم ماحول کے لیے، local planners فوری sensor feedback کی بنیاد پر مختصر مدت کی collision-free motions پیدا کرتے ہیں، اکثر global path کے ساتھ مل کر کام کرتے ہیں۔ مثالوں میں Dynamic Window Approach (DWA) یا Artificial Potential Fields شامل ہیں۔

**کوڈ مثال (تصوراتی A* تلاش):**

```python
import heapq

class Node:
    def __init__(self, position, g_cost, h_cost, parent=None):
        self.position = position
        self.g_cost = g_cost  # Cost from start to current node
        self.h_cost = h_cost  # Heuristic cost from current node to end
        self.f_cost = g_cost + h_cost # Total cost
        self.parent = parent

    def __lt__(self, other): # For min-heap functionality
        return self.f_cost < other.f_cost

def heuristic(a, b):
    # Manhattan distance heuristic for a grid
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def a_star_pathfinding(grid, start, end):
    open_list = []
    closed_list = set()

    start_node = Node(start, 0, heuristic(start, end))
    heapq.heappush(open_list, start_node)

    # Store g_cost for already visited nodes to check if a shorter path is found
    g_costs = {start: 0}

    path = {} # To reconstruct path

    while open_list:
        current_node = heapq.heappop(open_list)

        if current_node.position == end:
            # Path found, reconstruct it
            path_list = []
            while current_node:
                path_list.append(current_node.position)
                current_node = current_node.parent
            return path_list[::-1] # Reverse to get path from start to end

        closed_list.add(current_node.position)

        # Explore neighbors (up, down, left, right)
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            neighbor_pos = (current_node.position[0] + dx, current_node.position[1] + dy)

            # Check bounds and obstacles
            if not (0 <= neighbor_pos[0] < len(grid) and \
                    0 <= neighbor_pos[1] < len(grid[0]) and \
                    grid[neighbor_pos[0]][neighbor_pos[1]] == 0): # 0 means free space
                continue

            if neighbor_pos in closed_list:
                continue

            new_g_cost = current_node.g_cost + 1 # Assuming cost of 1 for each step

            if neighbor_pos not in g_costs or new_g_cost < g_costs[neighbor_pos]:
                g_costs[neighbor_pos] = new_g_cost
                neighbor_node = Node(neighbor_pos, new_g_cost, heuristic(neighbor_pos, end), current_node)
                heapq.heappush(open_list, neighbor_node)
                path[neighbor_pos] = current_node.position # Store parent for path reconstruction

    return None # No path found

# Example Usage:
# 0 = free, 1 = obstacle
grid_env = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
]

start_pos = (0, 0)
end_pos = (4, 4)

found_path = a_star_pathfinding(grid_env, start_pos, end_pos)
if found_path:
    print(f"Path found: {found_path}")
else:
    print("No path found.")

```

### ہیومنائڈز کے لیے Motion Planning میں چیلنجز

*   **اعلیٰ جہات:** ہیومنائڈز کے بہت سے joints ہیں، جو ایک بہت اعلیٰ جہتی C-space کی طرف لے جاتے ہیں، جو تلاش اور collision detection کو computationally intensive بناتے ہیں۔
*   **Dynamic ماحول:** حقیقی دنیا کے ماحول شاذ و نادر ہی مقررہ ہوتے ہیں۔ روبوٹس کو حرکت پذیر رکاوٹوں اور تبدیلیوں کے مطابق ڈھلنا ہوگا۔
*   **Kinodynamic پابندیاں:** ہیومنائڈز صرف نقطے نہیں ہیں؛ ان کے پاس mass، inertia، اور joint velocity/acceleration limits ہیں جن کا احترام کرنا ضروری ہے، جو سادہ geometric paths کو ناکافی بناتا ہے۔
*   **Balance اور Stability:** پہیوں والے روبوٹس کے برعکس، ہیومنائڈز کو مسلسل توازن برقرار رکھنا ہوگا، جو motion planning میں ایک اہم constraint شامل کرتا ہے۔
*   **حقیقی وقت کی کارکردگی:** منصوبہ بندی کافی تیزی سے ہونی چاہیے تاکہ روبوٹ اپنے ماحول پر رد عمل ظاہر کر سکے، خاص طور پر غیر منظم یا انسانوں سے بھرے ماحول میں۔

### سرگرمیاں

1.  **Grid Pathfinding:** چند "رکاوٹ" cells کے ساتھ ایک سادہ 5x5 grid بنائیں۔ شروعاتی اور آخری نقطہ منتخب کریں۔ راستہ تلاش کرنے کے لیے دستی طور پر A* الگورتھم (یا کوئی اور pathfinding الگورتھم) لگائیں، cells کی ترتیب کی فہرست بنائیں۔
2.  **C-Space Visualization:** ایک سادہ 2-link robotic بازو کا تصور کریں۔ اس کی 2-جہتی C-space کیسی نظر آئے گی، اور workspace میں ایک مستطیل رکاوٹ اس جگہ میں "C-obstacle" کے طور پر کیسے ظاہر ہوگی، اسکیچ کرنے کی کوشش کریں۔

### ڈایاگرام

_Placeholder برائے ڈایاگرام جو occupancy grid پر pathfinding الگورتھم (مثلاً A* تلاش) کو ظاہر کرتا ہے، شروعات، اختتام، رکاوٹیں، اور calculated path دکھاتا ہے۔_
*(یہ تصویر `/static/img/diagrams/part3-ch2-lesson4-motion-planning.svg` میں محفوظ کی جائے گی)*

### کثیر الانتخابی سوالات

1.  روبوٹکس میں **motion planning** کا بنیادی ہدف کیا ہے؟
    a) روبوٹ کے رنگ کا تعین کرنا۔
    b) ہدف حاصل کرنے کے لیے درست روبوٹ کنفیگریشنز کی ایک ترتیب پیدا کرنا۔
    c) روبوٹ کی جذباتی حالت کو کنٹرول کرنا۔
    d) ماحول میں اشیاء کی شناخت کرنا۔
    **جواب: b**

2.  کون سا الگورتھم **probabilistic motion planner** ہے جو اعلیٰ جہتی جگہوں کے لیے خاص طور پر موزوں ہے؟
    a) Dijkstra کا الگورتھم
    b) A* الگورتھم
    c) Rapidly-exploring Random Tree (RRT)
    d) Breadth-First Search
    **جواب: c**

3.  روبوٹ کی **Configuration Space (C-space)** کی نمائندگی کرتی ہے:
    a) روبوٹ کے زیر قبضہ حجم۔
    b) روبوٹ کی تمام ممکنہ joint configurations۔
    c) جسمانی جگہ جہاں روبوٹ کام کرتا ہے۔
    d) روبوٹ کے controller کے ذریعہ استعمال شدہ memory۔
    **جواب: b**

4.  A* الگورتھم کے لیے **optimal path** تلاش کرنے کی ضمانت دینے کے لیے، اس کا heuristic function ہونا ضروری ہے:
    a) Optimistic (لاگت کو زیادہ آنکتا ہے)۔
    b) Pessimistic (لاگت کو کم آنکتا ہے)۔
    c) Admissible (کبھی لاگت کو زیادہ نہیں آنکتا)۔
    d) ہمیشہ صفر۔
    **جواب: c**

5.  motion planning کے تناظر میں **occupancy grid** کیا ظاہر کرتا ہے؟
    a) روبوٹ کی بیٹری کی سطح۔
    b) ایک discretized ماحول جو آزاد اور مقبوضہ (رکاوٹ) cells دکھاتا ہے۔
    c) روبوٹ کی موجودہ joint velocities۔
    d) روبوٹس کے درمیان communication protocol۔
    **جواب: b**

6.  مخصوص طور پر **ہیومنائڈ روبوٹس** کے لیے motion planning میں کون سا ایک اہم چیلنج ہے؟
    a) ان کی degrees of freedom کی کم تعداد۔
    b) مسلسل توازن برقرار رکھنے کی ضرورت۔
    c) ان کی مقررہ نوعیت۔
    d) ان کے sensor سسٹمز کی سادگی۔
    **جواب: b**

7.  ایک **global planner** عام طور پر راستہ تلاش کرنے پر توجہ مرکوز کرتا ہے:
    a) dynamic اور نامعلوم ماحول میں۔
    b) مقررہ یا معلوم ماحول میں۔
    c) روبوٹ کی joint velocity space میں۔
    d) صرف بہت کم فاصلوں میں۔
    **جواب: b**

8.  motion planning میں **Collision Detection** کا مقصد کیا ہے؟
    a) روبوٹ کی بصری شکل کو بہتر بنانا۔
    b) چیک کرنا کہ آیا روبوٹ کا کوئی حصہ کسی رکاوٹ سے ٹکرا رہا ہے۔
    c) رکاوٹ کس قسم کے مواد سے بنی ہے اس کی شناخت کرنا۔
    d) روبوٹ کی رفتار کی پیمائش کرنا۔
    **جواب: b**

9.  جب راستہ مل جاتا ہے، تو **trajectory optimization** استعمال کیا جاتا ہے:
    a) روبوٹ کی رنگ سکیم تبدیل کرنے کے لیے۔
    b) راستے کو ہموار، dynamically feasible بنانے اور timing کی معلومات شامل کرنے کے لیے۔
    c) random حرکات پیدا کرنے کے لیے۔
    d) راستے کو تصاویر کی سیریز میں تبدیل کرنے کے لیے۔
    **جواب: b**

10. کون سا الگورتھم عام طور پر **grid map** پر مختصر ترین راستہ تلاش کرنے کے لیے ترجیح دی جائے گی اگر computational resources محدود ہیں اور ایک اچھا heuristic دستیاب ہے؟
    a) Dijkstra کا الگورتھم
    b) Breadth-First Search
    c) Depth-First Search
    d) A* الگورتھم
    **جواب: d**
