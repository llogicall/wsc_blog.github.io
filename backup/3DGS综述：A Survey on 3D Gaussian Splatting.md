## 1. 介绍
隐式辐射场（Implicit Radiance Field）：隐式辐射场能够表示场景中光线的分布，而无需明确定义场景的几何结构。NeRF 中，会使用一个或多个机器学习模型，将一组空间坐标和观察方向映射到特定的颜色和体积密度上：
<img width="240" height="36" alt="Image" src="https://github.com/user-attachments/assets/1db6adc7-9ca2-4882-9dbf-75406c4d9562" />
c是颜色参数，$\sigma$是体积密度参数
 
显式辐射场（Explicit Radiance Field）：显式辐射场直接表示了光在离散空间结构中的分布。与隐式辐射场类似，显式辐射场也可以这样表示：
<img width="329" height="46" alt="Image" src="https://github.com/user-attachments/assets/9efeefc1-4b94-4a98-ae76-58ec05ebe181" />

 3D 高斯：两种方法的结合优势，以可学习的 3D 高斯函数为数据结构的基础元素；同时，3D 高斯分割直接为每个高斯函数编码不透明度。

体积渲染（Volumetric rendering）：体积渲染的目的是将 3D 体积模型转换为图像，这一过程是通过沿相机光线传递辐射信息来实现的。
<img width="355" height="85" alt="Image" src="https://github.com/user-attachments/assets/8a4a9f80-43d6-4219-a10e-685284117e3c" />
其中，r(t)表示体积密度，c(r(t),d)表示该点颜色，T（t）表示透射率。光线追踪方法通过系统地沿着光线进行“步进”，并在离散的间隔处采样场景的属性，从而近似计算体积渲染积分。

基于点的渲染（Point-based rendering）：3D GS 采用 3D 高斯点作为基本渲染单元，这些点具有明确的属性特征（如颜色和不透明度），而不是隐式的神经特征。

## 2.原理

<img width="1617" height="430" alt="Image" src="https://github.com/user-attachments/assets/a7b75e19-35b6-4383-99bb-ccf64f85bd64" />
(a) splatting步骤将 3D 高斯分布投影到图像空间。(b) 3D 高斯滤波将图像分割成多个不重叠的块，即tiles。(c) 3D 高斯滤波会复制这些覆盖多个tiles的高斯分布，并为每个副本分配一个标识符，即tile ID。(d) 通过渲染这些排序后的高斯分布，我们可以获得每个瓦片内的所有像素。需要注意的是，像素和瓦片的处理流程是独立的，可以并行进行。







