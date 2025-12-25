---
sidebar_position: 6
sidebar_label: فورس کنٹرول اور ہیپٹکس
---

# ہیومنائڈ ہیرا پھیری میں فورس کنٹرول اور ہیپٹکس

## خلاصہ

*   **بازو کی کائنیمیٹکس:** قوتوں پر غور کیے بغیر ہیومنائڈ بازوؤں کی حرکت کا مطالعہ۔
*   **ہاتھ کی مہارت:** روبوٹک ہاتھوں کی پیچیدہ اور درست حرکات کرنے کی صلاحیت۔
*   **پکڑنے کی حکمت عملی:** ہیومنائڈز چیزوں کو محفوظ طریقے سے پکڑنے کے لیے استعمال کرتے ہیں۔

جبکہ پوزیشن کنٹرول ایک روبوٹ کو اپنے اینڈ ایفیکٹر کو خلا میں مطلوبہ نقطے پر منتقل کرنے کی اجازت دیتا ہے، بہت سے ہیرا پھیری کے کاموں میں روبوٹ کو قوتوں کے ذریعے اپنے ماحول کے ساتھ تعامل کرنے کی ضرورت ہوتی ہے۔ یہیں **فورس کنٹرول** کام آتا ہے۔ فورس کنٹرول ہیومنائڈز کو نازک کام انجام دینے، انسانوں کے ساتھ محفوظ طریقے سے تعامل کرنے، اور ماحول میں غیر یقینی صورتحال کے ساتھ موافقت کرنے کے قابل بناتا ہے۔ **ہیپٹکس**، دوسری طرف، چھونے کے احساس سے متعلق ہے، روبوٹ (یا اس کے انسانی آپریٹر) کو ان فزیکل تعاملات کے بارے میں فیڈ بیک فراہم کرتا ہے۔

### 1. فورس کنٹرول

فورس کنٹرول کا مقصد روبوٹ کی طرف سے اس کے ماحول پر لگائی جانے والی قوتوں کو منظم کرنا ہے۔ خالص پوزیشن کنٹرول کے برعکس، جہاں روبوٹ رابطے سے قطع نظر کسی پوزیشن تک پہنچنے کی کوشش کرتا ہے، فورس کنٹرول تعامل کے دوران ایک مخصوص فورس پروفائل کو یقینی بناتا ہے۔

#### فورس کنٹرول کی اقسام:

*   **ایکٹو سٹفنس کنٹرول (امپیڈنس کنٹرول):** روبوٹ ایک اسپرنگ اور ڈیمپر سسٹم کی طرح کام کرتا ہے۔ یہ بیرونی قوتوں پر رد عمل ظاہر کرنے کے لیے اپنی میکانیکل امپیڈنس (سختی اور ڈیمپنگ) کو کنٹرول کرتا ہے۔ اگر کوئی بیرونی قوت اسے دھکیلتی ہے، تو یہ ایک خاص سختی کے ساتھ پیچھے ہٹے گا، جو اسے موافق بناتا ہے۔ یہ اکثر انسان-روبوٹ تعامل کے لیے ترجیح دی جاتی ہے۔
*   **ایکٹو ڈیمپنگ کنٹرول (ایڈمیٹنس کنٹرول):** روبوٹ اپنی ایڈمیٹنس (امپیڈنس کا الٹا) کنٹرول کرتا ہے۔ یہ بیرونی قوتوں کو رفتار کمانڈز کے طور پر تشریح کرتا ہے۔ اگر کوئی بیرونی قوت اسے دھکیلتی ہے، تو یہ قوت کی سمت میں حرکت کرتا ہے۔
*   **ہائبرڈ فورس/پوزیشن کنٹرول:** یہ نقطہ نظر ٹاسک اسپیس کو ایسی سمتوں میں تقسیم کرتا ہے جہاں فورس کو کنٹرول کیا جاتا ہے اور ایسی سمتوں میں جہاں پوزیشن کو کنٹرول کیا جاتا ہے۔ مثال کے طور پر، جب کسی سطح کو صاف کریں، تو سطح کے عمود پر فورس کو کنٹرول کیا جاتا ہے (رابطے کا دباؤ برقرار رکھنے کے لیے)، جبکہ سطح کے متوازی پوزیشن کو کنٹرول کیا جاتا ہے (اس پر حرکت کرنے کے لیے)۔

**ہیومنائڈز میں اطلاقات:**
*   **اسمبلی کے کام:** تنگ رواداری کے ساتھ سوراخوں میں پیگز داخل کرنا۔
*   **پالش کرنا/سینڈنگ:** سطح پر مستقل رابطے کی قوت برقرار رکھنا۔
*   **انسان-روبوٹ تعاون:** محفوظ فزیکل تعامل جہاں روبوٹ انسانی چھونے سے پیچھے ہٹتا ہے۔
*   **چیزوں کی ہیرا پھیری:** نازک چیزوں کو کچلے بغیر سنبھالنا۔

### 2. ہیپٹکس اور ٹیکٹائل سینسنگ

روبوٹکس میں ہیپٹکس اس ٹیکنالوجی سے مراد ہے جو روبوٹ کو قوتوں کو محسوس کرنے اور لاگو کرنے کے ساتھ ساتھ ٹیکٹائل معلومات (چھونا، دباؤ، ساخت، پھسلن) کو سمجھنے کی اجازت دیتی ہے۔ ٹیکٹائل سینسرز روبوٹ کی "جلد" ہیں۔

#### ٹیکٹائل سینسرز کی اقسام:

*   **فورس/ٹارک سینسرز:** عام طور پر کلائی یا انگلیوں کی بنیاد پر رکھے جاتے ہیں، یہ اینڈ ایفیکٹر پر لاگو 6-محور قوتوں اور ٹارکس کی پیمائش کرتے ہیں۔
*   **پریشر سینسرز:** سینسرز کی صفیں جو سطح پر دباؤ کی تقسیم کو نقشہ بنا سکتی ہیں، رابطے کے علاقے اور چیز کی شکل کے بارے میں معلومات فراہم کرتی ہیں۔
*   **سلپ سینسرز:** چھوٹی تھرتھراہٹ یا شیئر فورسز کا پتہ لگاتے ہیں جو اشارہ کرتی ہیں کہ کوئی چیز پکڑ سے پھسل رہی ہے۔
*   **پراکسمٹی سینسرز:** براہ راست رابطے کے بغیر اشیاء کی موجودگی کا پتہ لگاتے ہیں، پہلے سے پکڑنے کی سیدھ کے لیے مفید۔

#### ہیرا پھیری میں ہیپٹکس کا کردار:

*   **بہتر پکڑ کا استحکام:** پکڑ کی قوت کو ایڈجسٹ کرنے کے لیے پھسلن کی ابتدائی علامات کا پتہ لگانا۔
*   **چیز کی شناخت:** چھونے کے ذریعے چیز کی خصوصیات جیسے سختی، ساخت، اور شکل کی شناخت۔
*   **ماہرانہ ہیرا پھیری:** باریک حرکات کرنا جن میں درست فورس اپلیکیشن اور ٹیکٹائل فیڈ بیک کی ضرورت ہوتی ہے، جیسے ٹائپنگ یا چھوٹے آلات کی ہیرا پھیری۔
*   **محفوظ تعامل:** یقینی بنانا کہ روبوٹ اشیاء یا انسانوں پر زیادہ قوت نہیں لگاتا۔

**کوڈ سنپٹ مثال (تصوراتی فورس کنٹرول لوپ):**

```python
# Conceptual Python for a simple impedance control loop
import time

class RobotArm:
    def __init__(self, target_position, target_force, stiffness=100.0, damping=10.0):
        self.current_position = 0.0 # simplified 1D position
        self.current_force = 0.0
        self.target_position = target_position
        self.target_force = target_force
        self.stiffness = stiffness # K
        self.damping = damping     # D

    def sense_environment_force(self):
        # Simulate sensing external force (e.g., contact with a surface)
        # In a real robot, this comes from a force sensor
        if abs(self.current_position - self.target_position) < 0.01:
            return 20.0 # Simulate contact force
        return 0.0

    def calculate_impedance_control_command(self, dt):
        # Calculate position error
        position_error = self.target_position - self.current_position

        # Sense external force
        external_force = self.sense_environment_force()
        self.current_force = external_force # Update sensed force

        # Impedance control law: F_command = K * (x_target - x_current) - D * v_current - F_external
        # Here, we want to achieve a desired force, so we regulate position based on force error

        # Let's consider a simple compliance control where position adjusts to maintain target force
        force_error = self.target_force - external_force

        # Adjust position based on force error (simplified admittance-like behavior)
        # Essentially, if sensed force is too low, move further; if too high, retract.
        # This is a high-level conceptualization.

        # A more common impedance control directly outputs a desired force/torque
        # based on position/velocity error, and a low-level torque controller
        # then executes it.

        # For simplicity, let's say we want to apply a constant force.
        # If sensed force < target_force, push more. If > target_force, retract.

        # Desired change in position for force regulation
        # This is an oversimplification but illustrates the concept of
        # adjusting motion based on force feedback.

        # In a true impedance control, the robot tries to behave like a mass-spring-damper
        # The desired force from the environment F_d = M * x_ddot + D * x_dot + K * (x - x_0)
        # The control law would then generate a torque to achieve this F_d.

        # For a practical example, let's conceptualize controlling position to achieve force:
        # If we need more force, push more. If less, retract.
        if force_error > 0.0: # Sensed force is less than target, need to push more
            self.current_position += 0.001 * dt # Small position increment
        elif force_error < 0.0: # Sensed force is more than target, need to retract
            self.current_position -= 0.001 * dt # Small position decrement

        # Limit movement
        self.current_position = max(0, min(1, self.current_position))

        return self.current_position # Output desired position for low-level controller

    def update(self, dt):
        desired_pos = self.calculate_impedance_control_command(dt)
        # Here, a low-level position controller would move the arm to 'desired_pos'
        # For this simulation, we just update position directly
        # In reality, there's a dynamic model and lower-level control

        # print(f"Time: {dt:.2f}, Current Pos: {self.current_position:.3f}, Sensed Force: {self.current_force:.2f}, Target Force: {self.target_force:.2f}")

# Simulation
arm = RobotArm(target_position=0.5, target_force=15.0) # Target position is nominal, target force is controlled
dt = 0.01 # time step
for i in range(1000):
    arm.update(dt)
    if i % 100 == 0:
        print(f"Step {i}, Current Pos: {arm.current_position:.3f}, Sensed Force: {arm.current_force:.2f}, Target Force: {arm.target_force:.2f}")
    time.sleep(0.001)

```

### سرگرمیاں

1.  **ٹیکٹائل سینسنگ ڈیزائن:** تصور کریں کہ آپ کو ایک ہیومنائڈ ہاتھ کی ضرورت ہے جو ہموار شیشے، کھردرے سینڈ پیپر، اور نرم اسپنج کے درمیان فرق کر سکے۔ آپ انگلیوں کے سروں میں کس قسم کے ٹیکٹائل سینسرز کو مربوط کریں گے، اور آپ یہ فرق کرنے کے لیے ان کے ڈیٹا کو کیسے پروسیس کریں گے؟
2.  **فورس کنٹرول منظر نامہ:** ایک ہیومنائڈ روبوٹ پر غور کریں جو ایک بزرگ شخص کو کھڑے ہونے میں مدد کر رہا ہے۔ حفاظت اور تاثیر کو یقینی بنانے کے لیے اس تعامل میں فورس کنٹرول کیسے اہم ہوگا؟ کس قسم کا فورس کنٹرول (امپیڈنس، ایڈمیٹنس، ہائبرڈ) سب سے زیادہ موزوں ہوگا اور کیوں؟

### ڈایاگرام

_ہائبرڈ فورس/پوزیشن کنٹرول کی وضاحت کرنے والے ڈایاگرام کے لیے پلیس ہولڈر۔ یہ وائٹ بورڈ پر لکھنے والے روبوٹ بازو کو دکھا سکتا ہے، بورڈ کے عمود پر فورس کنٹرول اور اس کے متوازی پوزیشن کنٹرول کے ساتھ۔_
*(یہ تصویر `/static/img/diagrams/part2-ch3-lesson6-force-haptics.svg` میں محفوظ کی جائے گی)*

### کثیر الانتخابی سوالات

1.  روبوٹکس میں **فورس کنٹرول** کا بنیادی مقصد کیا ہے؟
    a) بیرونی رابطے سے قطع نظر ہمیشہ ایک مقررہ پوزیشن برقرار رکھنا۔
    b) روبوٹ کی طرف سے اس کے ماحول پر لگائی جانے والی قوتوں کو منظم کرنا۔
    c) ہیرا پھیری کے کاموں کے دوران روبوٹ کی رفتار بڑھانا۔
    d) روبوٹ کی حرکات کو بصری طور پر زیادہ دلکش بنانا۔
    **جواب: b**

2.  کس قسم کا فورس کنٹرول روبوٹ کو اسپرنگ اور ڈیمپر کی طرح برتاؤ کرنے، بیرونی قوتوں سے پیچھے ہٹنے کی اجازت دیتا ہے؟
    a) ایڈمیٹنس کنٹرول
    b) ایکٹو ڈیمپنگ کنٹرول
    c) ایکٹو سٹفنس (امپیڈنس) کنٹرول
    d) ہائبرڈ فورس/پوزیشن کنٹرول
    **جواب: c**

3.  روبوٹکس میں **ہیپٹکس** بنیادی طور پر کس سے متعلق ہے:
    a) روبوٹ کی سمعی تصور۔
    b) روبوٹ کا چھونے کا احساس اور قوتیں لاگو کرنے کی صلاحیت۔
    c) روبوٹ کی بصری شناخت کی صلاحیتیں۔
    d) روبوٹ کا اندرونی نیویگیشن سسٹم۔
    **جواب: b**

4.  ہیرا پھیری کے کاموں کے لیے **فورس/ٹارک سینسر** عام طور پر روبوٹ بازو کے کس حصے پر رکھا جاتا ہے؟
    a) بازو کی بنیاد (کندھے)۔
    b) بازو کے درمیانی لنکس۔
    c) کلائی یا انگلیوں کی بنیاد۔
    d) روبوٹ کے دھڑ کے اندر۔
    **جواب: c**

5.  جب روبوٹ **سطح کو صاف کرنے** جیسا کام کر رہا ہو، تو کون سی فورس کنٹرول حکمت عملی استعمال کی جاتی ہے؟
    a) خالص پوزیشن کنٹرول
    b) خالص فورس کنٹرول (تمام سمتوں میں فورس کنٹرول)
    c) ہائبرڈ فورس/پوزیشن کنٹرول
    d) کشش ثقل معاوضہ کنٹرول
    **جواب: c**

6.  کون سا ٹیکٹائل سینسر یہ پتہ لگانے کے لیے سب سے زیادہ مفید ہے کہ کوئی چیز روبوٹ کی پکڑ سے پھسلنے والی ہے؟
    a) پریشر سینسرز
    b) پراکسمٹی سینسرز
    c) سلپ سینسرز
    d) درجہ حرارت سینسرز
    **جواب: c**

7.  **انسان-روبوٹ تعاون** کے لیے ڈیزائن کیا گیا روبوٹ جہاں حفاظت سب سے اہم ہے، تعامل کے لیے کون سی کنٹرول حکمت عملی استعمال کرے گا؟
    a) ہائی گین پوزیشن کنٹرول
    b) امپیڈنس کنٹرول
    c) اوپن لوپ کنٹرول
    d) ویژن پر مبنی کنٹرول
    **جواب: b**

8.  **پریشر سینسر صفیں** روبوٹک ہاتھ کو کس قسم کی معلومات فراہم کر سکتی ہیں؟
    a) چیز کا بالکل وزن۔
    b) رابطے کی قوتوں کی تقسیم اور چیز کی شکل۔
    c) چیز کی مادی ترکیب۔
    d) چیز کا درجہ حرارت۔
    **جواب: b**

9.  اگر روبوٹ کے اینڈ ایفیکٹر کو سطح کے عمود پر مستقل قوت برقرار رکھنی ہو جبکہ اس کے ساتھ حرکت کرے، تو یہ کلاسک اطلاق ہے:
    a) فارورڈ کائنیمیٹکس
    b) انورس کائنیمیٹکس
    c) ہائبرڈ فورس/پوزیشن کنٹرول
    d) امپیڈنس کنٹرول (خالص طور پر)
    **جواب: c**

10. ماہرانہ ہیرا پھیری میں **ٹیکٹائل فیڈ بیک** استعمال کرنے کا ایک اہم فائدہ کیا ہے؟
    a) پیچیدہ ویژن سسٹمز کی ضرورت کو کم کرنا۔
    b) روبوٹ کو بھاری چیزیں اٹھانے کے قابل بنانا۔
    c) باریک حرکات کرنا جن میں درست فورس اپلیکیشن اور تعامل کی سمجھ کی ضرورت ہوتی ہے۔
    d) روبوٹ کی مجموعی رفتار بڑھانا۔
    **جواب: c**
