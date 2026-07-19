import crypto from "crypto";

import { User } from "#src/models/User.js";
import { Product } from "#src/models/Product.js";
import { Session } from "#src/models/Session.js";

import UserObject from "#src/classes/UserObject.js";
import ApiResponse from "#src/classes/ApiResponse.js";

export const listProducts = async (req, res) => {
    try {
        let products = await Product.find({ isVisible: true }).sort({ createdAt: -1 });

        const sessionToken = req.cookies.session_token;
        if (sessionToken) {

            const tokenHash = crypto
                .createHash("sha256")
                .update(sessionToken)
                .digest("hex");

            const session = await Session.findOne({ hash: tokenHash });

            if (!session || session.expiresAt < new Date()) {
                if (session) {
                    await Session.deleteOne({ _id: session._id });
                }

                res.clearCookie("session_token");
            }
            else {

                const user = await User.findById(session.userId);

                if (!user) {
                    res.clearCookie("session_token");
                } else {
                    req.user = new UserObject(user);
                }
            }
        }

        if (req.user) {
            products = products.filter(product => product.positions.includes(req.user.role));
        }

        return res.status(200).json(new ApiResponse(200, 'Products retrieved successfully', { products }));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
    }
}

export const listAllProducts = async (req, res) => {
    try {
        let products = await Product.find().sort({ createdAt: -1 });

        return res.status(200).json(new ApiResponse(200, 'Products retrieved successfully', { products }));
    } catch (error) {
        console.error('Error retrieving all products:', error);
        return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
    }
}

export const getProductById = async (req, res) => {
    try {
        if (!req.params?.id) {
            return res.status(400).json(new ApiResponse(400, 'Product ID is required', {}));
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json(new ApiResponse(404, 'Product not found', {}));
        }

        if (product.isVisible === false && (!req.user || !["EB"].includes(req.user.role))) {
            return res.status(403).json(new ApiResponse(403, 'Access denied', {}));
        }

        return res.status(200).json(new ApiResponse(200, 'Product retrieved successfully', { product }));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
    }
}

export const createProduct = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(new ApiResponse(400, 'Product data is required', {}));
        }

        const {
            name, description, isVisible, positions, price, image, userInputs
        } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json(new ApiResponse(400, 'Product name is required', {}));
        }

        if (!price || isNaN(price)) {
            return res.status(400).json(new ApiResponse(400, 'Product price must be a valid number', {}));
        }

        const positionsArray = Array.isArray(positions) ? positions : ["EB", "CORE", "MEMBER"];
        if (!positionsArray.every(pos => ["EB", "CORE", "MEMBER"].includes(pos))) {
            return res.status(400).json(new ApiResponse(400, 'Invalid positions provided', {}));
        }

        if (userInputs && !Array.isArray(userInputs)) {
            return res.status(400).json(new ApiResponse(400, 'User inputs must be an array', {}));
        }

        if (userInputs.length > 0) {
            for (const input of userInputs) {
                if (!input.question || input.question.trim() === '') {
                    return res.status(400).json(new ApiResponse(400, 'User input question is required', {}));
                }

                if (typeof input.isImageInput !== 'boolean') {
                    return res.status(400).json(new ApiResponse(400, 'User input isImageInput must be a boolean', {}));
                }

                if (typeof input.isRequired !== 'boolean') {
                    return res.status(400).json(new ApiResponse(400, 'User input isRequired must be a boolean', {}));
                }
            }
        }

        const product = await Product.create({
            name,
            description,
            isVisible: isVisible !== undefined ? isVisible : true,
            positions: positionsArray,
            price,
            image,
            userInputs: userInputs || [],
        });

        return res.status(201).json(new ApiResponse(201, 'Product created successfully', { product }));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
    }
}

export const updateProduct = async (req, res) => {
    try {
        if (!req.params?.id) {
            return res.status(400).json(new ApiResponse(400, 'Product ID is required', {}));
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json(new ApiResponse(404, 'Product not found', {}));
        }

        const {
            name, description, isVisible, positions, price, image, userInputs
        } = req.body;

        if (name !== undefined) {
            if (name.trim() === '') {
                return res.status(400).json(new ApiResponse(400, 'Product name cannot be empty', {}));
            }
            product.name = name;
        }

        if (description !== undefined) {
            product.description = description;
        }

        if (isVisible !== undefined) {
            product.isVisible = isVisible;
        }

        if (positions !== undefined) {
            const positionsArray = Array.isArray(positions) ? positions : ["EB", "CORE", "MEMBER"];
            if (!positionsArray.every(pos => ["EB", "CORE", "MEMBER"].includes(pos))) {
                return res.status(400).json(new ApiResponse(400, 'Invalid positions provided', {}));
            }
            product.positions = positionsArray;
        }

        if (price !== undefined) {
            if (isNaN(price)) {
                return res.status(400).json(new ApiResponse(400, 'Product price must be a valid number', {}));
            }
            product.price = price;
        }

        if (image !== undefined) {
            product.image = image;
        }

        if (userInputs !== undefined) {
            if (!Array.isArray(userInputs)) {
                return res.status(400).json(new ApiResponse(400, 'User inputs must be an array', {}));
            }
            for (const input of userInputs) {
                if (!input.question || input.question.trim() === '') {
                    return res.status(400).json(new ApiResponse(400, 'User input question is required', {}));
                }

                if (typeof input.isImageInput !== 'boolean') {
                    return res.status(400).json(new ApiResponse(400, 'User input isImageInput must be a boolean', {}));
                }

                if (typeof input.isRequired !== 'boolean') {
                    return res.status(400).json(new ApiResponse(400, 'User input isRequired must be a boolean', {}));
                }

            }
            product.userInputs = userInputs;
        }

        await product.save();

        return res.status(200).json(new ApiResponse(200, 'Product updated successfully', { product }));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
    }
}

export const deleteProduct = async (req, res) => {
    try {
        if (!req.params?.id) {
            return res.status(400).json(new ApiResponse(400, 'Product ID is required', {}));
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json(new ApiResponse(404, 'Product not found', {}));
        }

        await Product.deleteOne({ _id: product._id });

        return res.status(200).json(new ApiResponse(200, 'Product deleted successfully', {}));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, 'Internal Server Error', { message: error.message }));
    }
}